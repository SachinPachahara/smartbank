const express = require("express");
const router = express.Router();
const {
  validatePassword,
  checkPassword,
} = require("../middlewares/userMiddleware/userMiddlewares");
const {
  authUserProtect,
} = require("../middlewares/userMiddleware/authUsersMiddleware");

const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminsMiddleware");

const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  userLogin,
  updateUserStatus,
  notificationUpdate,
  forgotPassword,
  resetPassword,
} = require("../controllers/usersControllers");
const {
  checkUserStatus,
} = require("../middlewares/userMiddleware/checkUserStatus");
const {
  authLimiter,
} = require("../middlewares/rateLimitMiddleware/rateLimitMiddleware");

router
  .route("/")
  .get(authAdminProtect, getUsers)
  .post(validatePassword, createUser);

router
  .route("/:id")
  .get(authUserProtect, getOneUser)
  .put(
    authUserProtect,
    checkUserStatus,
    checkPassword,
    validatePassword,
    updateUser
  )
  .delete(authAdminProtect, deleteUser);

router.route("/login").post(authLimiter, userLogin);
router.route("/forgot-password").post(authLimiter, forgotPassword);
router.route("/reset-password").post(authLimiter, resetPassword);

router.route("/:id/updatestatus").put(authAdminProtect, updateUserStatus);

router
  .route("/notifications/:id")
  .put(authUserProtect, checkUserStatus, notificationUpdate);

module.exports = router;
