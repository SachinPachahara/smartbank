const mongoose = require("mongoose");
const Contact = require("../models/contactModel");
const User = require("../models/userModel");

// Helper to reliably find user by auto-increment ID or email
const findUserForTicket = async (userId, email) => {
  let user = null;
  if (userId) {
    const numId = Number(userId);
    user = await User.findOne({
      $or: [
        { _id: userId },
        ...(isNaN(numId) ? [] : [{ _id: numId }]),
      ],
    });
  }
  if (!user && email) {
    user = await User.findOne({ email: email.toLowerCase().trim() });
  }
  return user;
};

//@desc   >>>> Create new support ticket / contact inquiry
//@route  >>>> POST /api/contact
//@Access >>>> Public / Authenticated
const createContactTicket = async (req, res) => {
  try {
    const { name, email, message, userId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send("Name, Email, and Message are all required.");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).send("Please provide a valid email address.");
    }

    const ticketId = `TCK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Clean userId and attempt user match by ID or Email
    const matchedUser = await findUserForTicket(userId, cleanEmail);
    const finalUserId = matchedUser ? matchedUser._id.toString() : (userId ? String(userId).trim() : null);

    const newTicket = await Contact.create({
      ticketId,
      name: name.trim(),
      email: cleanEmail,
      message: message.trim(),
      userId: finalUserId,
      status: "OPEN",
      resolutionNote: "",
    });

    // If matched to a customer, log an incoming notification
    if (matchedUser) {
      try {
        matchedUser.notifications.push({
          type: "support-ticket",
          title: "Support Ticket Created",
          message: `Your inquiry has been logged under Ticket #${ticketId}. Our banking helpdesk will review it shortly.`,
          data: [{ ticket_id: ticketId }],
        });
        matchedUser.markModified("notifications");
        await matchedUser.save();
      } catch (notifErr) {
        console.warn("Could not save creation notification:", notifErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Your message has been sent successfully! Our support desk has logged Ticket #${ticketId}.`,
      ticketId,
    });
  } catch (error) {
    console.error("Contact error details:", error);
    return res.status(500).send(`Ooops!! Something went wrong: ${error.message}`);
  }
};

//@desc   >>>> Get all support tickets (admin view)
//@route  >>>> GET /api/contact
//@Access >>>> Private (Admins only)
const getContactTickets = async (req, res) => {
  try {
    const tickets = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).send("Failed to retrieve tickets.");
  }
};

//@desc   >>>> Get current user's submitted support tickets
//@route  >>>> GET /api/contact/my
//@Access >>>> Private (User)
const getMyTickets = async (req, res) => {
  try {
    const userIdStr = req.user ? String(req.user.id || req.user._id).trim() : null;
    const userEmail = req.user ? req.user.email.toLowerCase().trim() : null;

    const queries = [];
    if (userIdStr) queries.push({ userId: userIdStr });
    if (userEmail) queries.push({ email: userEmail });

    if (queries.length === 0) {
      return res.status(200).json([]);
    }

    const myTickets = await Contact.find({ $or: queries }).sort({ createdAt: -1 });
    return res.status(200).json(myTickets);
  } catch (error) {
    console.error("Get my tickets error:", error);
    return res.status(500).send("Failed to retrieve your tickets.");
  }
};

//@desc   >>>> Update ticket status & send resolution note to customer
//@route  >>>> PUT /api/contact/:id
//@Access >>>> Private (Admins only)
const updateTicketStatus = async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const ticket = await Contact.findById(req.params.id);

    if (!ticket) {
      return res.status(404).send("Ticket not found.");
    }

    if (status) ticket.status = status;

    const trimmedNote =
      resolutionNote && typeof resolutionNote === "string"
        ? resolutionNote.trim()
        : "";

    if (trimmedNote) {
      ticket.resolutionNote = trimmedNote;
    } else if (!ticket.resolutionNote && status === "RESOLVED") {
      ticket.resolutionNote =
        "Your inquiry has been reviewed and resolved by SmartBank staff.";
    }

    await ticket.save();

    // Look up customer by userId OR email
    const user = await findUserForTicket(ticket.userId, ticket.email);

    if (user) {
      try {
        const actionWord = status === "RESOLVED" ? "Resolved" : "Updated";
        const noteText =
          ticket.resolutionNote ||
          "Your query has been updated and processed by bank staff.";

        user.notifications.push({
          type: "ticket-update",
          title: `Support Ticket ${actionWord}`,
          message: `[Ticket #${ticket.ticketId}] Status: ${ticket.status}. Admin Response: ${noteText}`,
          data: [{ ticket_id: ticket.ticketId }],
        });
        user.markModified("notifications");
        await user.save();
      } catch (notifErr) {
        console.warn("Could not save resolution notification to user:", notifErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Ticket #${ticket.ticketId} updated to ${ticket.status}.`,
      ticket,
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    return res.status(500).send("Failed to update ticket.");
  }
};

module.exports = {
  createContactTicket,
  getContactTickets,
  getMyTickets,
  updateTicketStatus,
};
