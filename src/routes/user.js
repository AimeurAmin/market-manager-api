const express = require("express");
const auth = require("../middleware/auth");
const {
  profile,
  updatePassword,
  updateProfile,
  deleteAccount,
  logout,
  logoutAllSessions,
  signup,
  login,
  uploadAvatar,
  errorController: errorHandler,
  deleteAvatar,
  getAvatarByUserId,
} = require("../controllers/user");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { welcomeMail } = require("../emails/welcome-email");

const upload = multer({
  // dest: "images", // disabled to prevent multer from saving images on any folder (heroku and such deployment platforms delete such folders)! so instead of saving the upload to a folder on the server multer just passes it through to us inside req.file
  limits: {
    fileSize: 2000000, // 2MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

const router = express.Router();

// GET USER AVATAR
router.get("/users/:id/avatar", getAvatarByUserId);
// ----- Private routes -----

// GET CURRENT USER PROFILE
router.get("/users/me", auth, profile);

// UPDATE PASSWORD
router.patch("/users/me/password", auth, updatePassword);

// UPDATE PROFILE INFO
router.patch("/users/me", auth, updateProfile);

// DELETE ACCOUNT
router.delete("/users/me", auth, deleteAccount);

// LOGOUT
router.post("/users/logout", auth, logout);

// LOGOUT ALL SESSIONS
router.post("/users/logoutAll", auth, logoutAllSessions);

// UPLOAD PROFILE AVATAR
router.post(
  "/users/me/avatar",
  upload.single("avatar"),
  auth,
  uploadAvatar,
  errorHandler
);

// DELETE AVATAR
router.delete("/users/me/avatar", auth, deleteAvatar);

// ----- Public routes -----

// SIGNUP
router.post("/users", signup);

// LOGIN
router.post("/users/login", login);

// localhost:3000/confirm?token=slkjfqlsknvlkjndqlvkjqnflkjvnq

// CONFIRM EMAIL
router.get("/confirm", async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send("You are not allowed to execute this action!");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    _id: decodedToken._id,
    "tokens.token": token,
  });

  if (!user) {
    return res.status(400).send("You are not allowed to execute this action!");
  }
  user.confirmed = true;
  user.tokens = [];
  await user.save();
  res.send("your account has been confirmed!");
});

router.get("/reConfirmMyAccount", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user || !email) {
    return res.status(400).send("Something went wrong");
  }
  const token = await user.generateAuthToken();
  user.tokens = [{ token }];
  await user.save();
  // welcomeMail(user.email, user.name, token);

  res.send("Please verify your Mail-box to confirm your account!");
});

router.get("/askForNewPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("could not find this email");
    }

    const token = await user.generateAuthToken();

    user.resetToken = token;

    await user.save();

    res.send("An email was sent to you to update your password!");
  } catch (error) {
    return res.status(404).send(error);
  }
});

router.post("/resetPassword", async (req, res) => {
  const allowedUpdates = ["token", "password", "confirmPassword"];
  const updateFields = Object.keys(req.body);

  const validFields = updateFields.filter((field) =>
    allowedUpdates.includes(field)
  );

  console.log("here");
  if (validFields.length < 3) {
    console.log("wsel");
    return res.status(400).send({
      error: `The following fields are not allowed: ${[...allowedUpdates]}`,
      allowedUpdates,
    });
  }

  const { token, password, confirmPassword } = req.body;

  if (confirmPassword !== password) {
    return res.status(400).send("Passwords does not match");
  }
  if (!token) {
    return res.status(400).send("You are not allowed to execute this action!");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    _id: decodedToken._id,
    resetToken: token,
  });

  if (!user) {
    return res.status(400).send("You are not allowed to execute this action!");
  }
  user.password = password;
  user.resetToken = undefined;

  await user.save();

  res.send("your password has been updated.");
});

module.exports = router;
