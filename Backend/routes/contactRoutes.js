const express = require("express");
const router = express.Router();
const {
  createContactTicket,
  getContactTickets,
  updateTicketStatus,
} = require("../controllers/contactController");
const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminsMiddleware");

router
  .route("/")
  .post(createContactTicket)
  .get(authAdminProtect, getContactTickets);

router
  .route("/:id")
  .put(authAdminProtect, updateTicketStatus);

module.exports = router;
