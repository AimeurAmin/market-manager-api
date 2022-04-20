import express from "express";
import auth from "../middleware/auth.js";
import {
  profile,
  updatePassword,
  updateProfile,
  deleteAccount,
  logout,
  logoutAllSessions,
  signup,
  login,
  uploadAvatar,
  errorController,
  deleteAvatar,
  getAvatarByUserId,
  resetPassword,
  askForNewPassword,
  reConfirmMyAccount,
  confirmAccount,
} from "../controllers/user.js";
import multer from "multer";
import jwt from "jsonwebtoken";
import welcomeMail  from "../emails/welcome-email.js";
import User from "../models/user.js";
import Company from "../models/company.js";

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

// ASK FOR EMAIL TO RESET PASSWORD
router.get("/askForNewPassword", askForNewPassword);

// RESET PASSWORD
router.post("/resetPassword", resetPassword);

// UPLOAD PROFILE AVATAR
router.post(
  "/users/me/avatar",
  upload.single("avatar"),
  auth,
  uploadAvatar,
  errorController
);

// DELETE AVATAR
router.delete("/users/me/avatar", auth, deleteAvatar);

// ----- Public routes -----

// SIGNUP
router.post("/users", signup);

// LOGIN
router.post("/users/login", login);

// CONFIRM EMAIL
router.get("/confirm", confirmAccount);

// RE-SEND A CONFIRMATION EMAIL
router.get("/reConfirmMyAccount", reConfirmMyAccount);

// LIST OF USERS RELATED TO CURRENT COMPANY
router.get("/myCompanyUsers", auth, async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
  const company = await Company.findById(decodedToken.company_id).populate(
    "users"
  );
  res.send({ users: company.users });
});

export default router;
