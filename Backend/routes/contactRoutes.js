const express = require("express");
const router = express.Router();
const {
  createContactTicket,
  getContactTickets,
} = require("../controllers/contactController");
const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminsMiddleware");

router
  .route("/")
  .post(createContactTicket)
  .get(authAdminProtect, getContactTickets);

module.exports = router;
