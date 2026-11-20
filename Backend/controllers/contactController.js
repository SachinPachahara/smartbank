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
    if (!emailRegex.test(email)) {
      return res.status(400).send("Please provide a valid email address.");
    }

    const ticketId = `TCK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newTicket = await Contact.create({
      ticketId,
      name,
      email,
      message,
      userId: userId || null,
      status: "OPEN",
    });

    // If userId exists, add a notification to the user's account
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.notifications.push({
            type: "support-ticket",
            title: "Support Ticket Created",
            message: `Your support request has been logged under Ticket #${ticketId}. Our banking helpdesk will respond shortly.`,
            data: [{ ticket_id: ticketId }],
          });
          user.markModified("notifications");
          await user.save();
        }
      } catch (_) {}
    }

    return res.status(201).json({
      success: true,
      message: `Your message has been sent successfully! Our support desk has logged Ticket #${ticketId}.`,
      ticketId,
    });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).send("Ooops!! Something went wrong while submitting your message.");
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

module.exports = {
  createContactTicket,
  getContactTickets,
};
