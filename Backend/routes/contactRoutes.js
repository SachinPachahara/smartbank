const express = require("express");
const router = express.Router();
const {
  createContactTicket,
  getContactTickets,
  getMyTickets,
  updateTicketStatus,
} = require("../controllers/contactController");
const {
  authUserProtect,
} = require("../middlewares/userMiddleware/authUsersMiddleware");
const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminsMiddleware");

// Customer route to view their own tickets
router.route("/my").get(authUserProtect, getMyTickets);

// General ticket creation and admin overview
router
  .route("/")
  .post(createContactTicket)
  .get(authAdminProtect, getContactTickets);

// Admin status update
router
  .route("/:id")
  .put(authAdminProtect, updateTicketStatus);

module.exports = router;
