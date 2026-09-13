const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { generateUsersToken } = require("../helpers/generateUsersToken");

//@desc   >>>> Get All Users
//@route  >>>> GET /api/users
//@Access >>>> private(admins)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "_id user_name email user_status no_of_account"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Get one User
//@route  >>>> GET /api/users/:id
//@Access >>>> private(User)
const getOneUser = async (req, res) => {
  let user;
  try {
    if (req.user && req.user.id.toString() !== req.params.id) {
      return res.status(403).send("Forbidden: Access denied to other user's profile");
    }
    user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User Not Found!");
    res.status(200).json({
      name: user.user_name,
      email: user.email,
      address: user.full_addresse,
      id: user.id,
      accountsCount: user.no_of_account,
      createdAt: user.createdAt,
      userStatus: user.user_status,
      postal: user.zip_code,
      phone: user.phone,
      accounts: user.accounts,
      notifications: user.notifications,
    });
  } catch (error) {
    if (!user) return res.status(404).send("User Not Found!");
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Create one User
//@route  >>>> POST /api/users/:id
//@Access >>>> public
const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      user_name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      full_addresse: req.body.addresse,
      zip_code: req.body.postal,
    });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateUsersToken(user.id, user.email),
    });
  } catch (error) {
    if (error.message.match(/(email|password|name|postal|phone|addresee)/gi)) {
      return res.status(400).send(error.message);
    }
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> user login
//@route  >>>> POST /api/users/login
//@Access >>>> public
const userLogin = async (req, res) => {
  //check for empty body
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Please provide both email and password");
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).send("Invalid email or password");
    }

    return res.status(200).json({
      id: user.id,
      name: user.user_name || user.name,
      email: user.email,
      token: generateUsersToken(user.id, user.email),
    });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> UPDATE User info
//@route  >>>> PUT /api/users/:id
//@Access >>>> private(for User only)
const updateUser = async (req, res) => {
  try {
    if (req.user && req.user.id.toString() !== req.params.id) {
      return res.status(403).send("Forbidden: Cannot modify another user's profile");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //get user
    const user = await User.findById(req.params.id);
    //update user with new values
    user.email = req.body.email;
    user.markModified("email");
    user.password = hashedPassword;
    user.markModified("password");
    user.phone = req.body.phone;
    user.markModified("phone");
    user.full_addresse = req.body.addresse;
    user.markModified("full_addresse");
    user.zip_code = req.body.postal;
    user.markModified("zip_code");

    //get updated user info & send it back
    const updatedUser = await user.save();

    res.status(200).json({
      name: updatedUser.user_name,
      email: updatedUser.email,
      address: updatedUser.full_addresse,
      id: updatedUser.id,
      accountsCount: updatedUser.no_of_account,
      createdAt: updatedUser.createdAt,
      userStatus: updatedUser.user_status,
      postal: updatedUser.zip_code,
      phone: updatedUser.phone,
      accounts: updatedUser.accounts,
      notifications: updatedUser.notifications,
    });
  } catch (error) {
    if (error.message.match(/(email|password|name|postal|phone|addresee)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Notification isSeen update
//@route  >>>> PUT /api/users/notifications/:id
//@Access >>>> private(for User only)
const notificationUpdate = async (req, res) => {
  try {
    //get user
    const user = req.user;
    //update notification status
    user.notifications = user.notifications.map((notification) => {
      if (notification.id === req.params.id) {
        return { ...notification, isSeen: true };
      }
      return notification;
    });
    user.markModified("notifications");

    //get updated user info & send it back
    const updatedUser = await user.save();

    res.status(200).json({
      name: updatedUser.user_name,
      email: updatedUser.email,
      address: updatedUser.full_addresse,
      id: updatedUser.id,
      accountsCount: updatedUser.no_of_account,
      createdAt: updatedUser.createdAt,
      userStatus: updatedUser.user_status,
      postal: updatedUser.zip_code,
      phone: updatedUser.phone,
      accounts: updatedUser.accounts,
      notifications: updatedUser.notifications,
    });
  } catch (error) {
    if (error.message.match(/(notification)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete one User
//@route  >>>> DELETE /api/users/:id
//@Access >>>> private(for admins only)
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedUser.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Update User's Status
//@route  >>>> put /api/users/:id/updatestatus
//@Access >>>> private(for admins only)
const updateUserStatus = async (req, res) => {
  //check if new status is actually the old status
  if (req.body.newStatus === req.body.oldStatus) {
    return res.status(400).send("Please Specify New Status For That User");
  }
  try {
    //get user
    const user = await User.findById(req.params.id);
    //update user with new Status
    user.user_status = req.body.newStatus;
    user.markModified("user_status");

    //get updated user info & send it back
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser.id,
      user_name: updatedUser.user_name,
      email: updatedUser.email,
      no_of_account: updatedUser.no_of_account,
      user_status: updatedUser.user_status,
    });
  } catch (error) {
    if (error.message.match(/(email|password|name|postal|phone|addresee)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};
//@desc   >>>> Forgot Password - Request OTP
//@route  >>>> POST /api/users/forgot-password
//@Access >>>> Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("Please provide your registered email address");
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).send("No account found with this email address");
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = expiry;
    await user.save();

    console.log(`[SmartBank Security] Password Reset OTP for ${user.email}: ${otp}`);

    const responsePayload = {
      message: "Password reset OTP sent to your registered email",
      email: user.email,
    };
    // Include simulation OTP only in non-production for local dev/testing
    if (process.env.NODE_ENV !== "production") {
      responsePayload.simulatedOtp = otp;
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Reset Password - Verify OTP & Set New Password
//@route  >>>> POST /api/users/reset-password
//@Access >>>> Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send("Please provide email, verification OTP, and new password");
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).send("User account not found");
    }

    if (
      !user.resetPasswordToken ||
      user.resetPasswordToken !== otp.toString().trim() ||
      !user.resetPasswordExpires ||
      new Date(user.resetPasswordExpires) < new Date()
    ) {
      return res.status(400).send("Invalid or expired verification code");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).send(
        "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (!@#$%^&*)"
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      message: "Password has been successfully reset. Please log in with your new password.",
    });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  userLogin,
  updateUser,
  deleteUser,
  updateUserStatus,
  notificationUpdate,
  forgotPassword,
  resetPassword,
};
