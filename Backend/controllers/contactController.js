const mongoose = require("mongoose");
const Contact = require("../models/contactModel");
const User = require("../models/userModel");

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
    if (!emailRegex.test(email.trim())) {
      return res.status(400).send("Please provide a valid email address.");
    }

    const ticketId = `TCK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Clean valid string or null for userId
    const safeUserId = userId && typeof userId === "string" && userId.trim() ? userId.trim() : null;

    const newTicket = await Contact.create({
      ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      userId: safeUserId,
      status: "OPEN",
    });

    // Attempt to add notification if user exists, but NEVER fail the ticket creation if notification fails
    if (safeUserId && mongoose.Types.ObjectId.isValid(safeUserId)) {
      try {
        const user = await User.findById(safeUserId);
        if (user) {
          user.notifications.push({
            type: "support-ticket",
            title: "Support Ticket Created",
            message: `Your inquiry has been logged under Ticket #${ticketId}. Our banking helpdesk will review it shortly.`,
            data: [{ ticket_id: ticketId }],
          });
          user.markModified("notifications");
          await user.save();
        }
      } catch (notifErr) {
        console.warn("Could not save notification to user document:", notifErr.message);
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
    await ticket.save();

    // If linked to a customer, send notification to their portal safely
    if (ticket.userId && mongoose.Types.ObjectId.isValid(ticket.userId)) {
      try {
        const user = await User.findById(ticket.userId);
        if (user) {
          const actionWord = status === "RESOLVED" ? "Resolved" : "Updated";
          user.notifications.push({
            type: "ticket-update",
            title: `Support Ticket ${actionWord}`,
            message: `[Ticket #${ticket.ticketId}] Status: ${status}. ${
              resolutionNote ? `Admin Note: ${resolutionNote}` : "Your query has been updated by bank staff."
            }`,
            data: [{ ticket_id: ticket.ticketId }],
          });
          user.markModified("notifications");
          await user.save();
        }
      } catch (notifErr) {
        console.warn("Could not notify user on ticket update:", notifErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Ticket #${ticket.ticketId} updated to ${status}.`,
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
  updateTicketStatus,
};
