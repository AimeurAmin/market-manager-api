const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const profile = async (req, res) => {
  res.send(req.user);
};

const updatePassword = async (req, res) => {
  const allowedUpdates = ["password", "confirmPassword", "newPassword"];
  const updateFields = Object.keys(req.body);

  const invalidFields = updateFields.filter(
    (field) => !allowedUpdates.includes(field)
  );

  if (!allowedUpdates.every((field) => updateFields.includes(field))) {
    return res.status(400).send({
      error: `To update your password you need to provide your old password (password), a confirmation of the old password (confirmPassword), and the new password (newPassword)`,
      necessaryFields: allowedUpdates,
    });
  }

  if (invalidFields > 0) {
    return res.status(400).send({
      error: `The following fields are not allowed: ${[...invalidFields]}`,
      invalidFields,
    });
  }

  try {
    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .send(`password and confirmation password don't match.`);
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      req.user.password
    );

    if (!validPassword) {
      return res
        .status(400)
        .send(
          `Invalid password! for your security, please verify your old password and try again. if you forgot your old password please contact us!`
        );
    }

    req.user.password = req.body.newPassword;

    await req.user.save();

    res.send("Password updated successfully");
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateProfile = async (req, res) => {
  const allowedUpdates = ["name", "email", "age"];
  const updateFields = Object.keys(req.body);

  const invalidFields = updateFields.filter(
    (field) => !allowedUpdates.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).send({
      error: `The following fields are not allowed: ${[...invalidFields]}`,
      invalidFields,
    });
  }

  try {
    // const user = await User.findById(req.params.id);

    // updateFields.forEach((update) => (user[update] = req.body[update]));

    // await user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    updateFields.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const validPass = await bcrypt.compare(
      req.body?.password || "",
      req.user.password
    );

    if (validPass) {
      await User.findByIdAndDelete(req.user._id);
      // if (!user) {
      //   return res.status(404).send("User not found!");
      // }
      // await req.user.remove();
      res.send("This account was deleted successfully.");
    } else {
      res
        .status(400)
        .send(
          "Invalid password! For your security please verify your password before being able to proceed."
        );
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();
    res.send("Logged out");
  } catch (error) {
    res.status(500).send(error);
  }
};

const logoutAllSessions = async (req, res) => {
  try {
    const validPass = await bcrypt.compare(
      req.body?.password,
      req.user.password
    );

    if (validPass) {
      req.user.tokens = [];
      await req.user.save();
      res.send("logged out all of your sessions successfully");
    } else {
      res
        .status(400)
        .send(
          "Invalid password! could not logout all of your sessions! please verify your password and try again"
        );
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const uploadAvatar = async (req, res) => {
  req.user.avatar = req.file.buffer;
  await req.user.save();
  res.send();
};

const getAvatarByUserId = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.avatar) {
    throw new Error("User does not have an avatar");
  }

  res.set("Content-Type", "image/jpg");
  res.send(user.avatar);
};

const deleteAvatar = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send("Avatar cleared");
};

const errorController = (error, req, res, next) => {
  res.status(400).send({ error: error.message, status: 400 });
};

const signup = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    if (!user.confirmed) {
      throw new Error("This account was not confirmed yet!");
    }
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    return res.status(400).send("Unable to login - " + error);
  }
};

const resetPassword = async (req, res) => {
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
};

const askForNewPassword = async (req, res) => {
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
};

const reConfirmMyAccount = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user || !email) {
    return res.status(400).send("Something went wrong");
  }
  const token = await user.generateAuthToken();
  user.tokens = [{ token }];
  await user.save();

  res.send("Please verify your Mail-box to confirm your account!");
};

const confirmAccount = async (req, res) => {
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
};

module.exports = {
  profile,
  updatePassword,
  updateProfile,
  deleteAccount,
  logout,
  logoutAllSessions,
  uploadAvatar,
  deleteAvatar,
  getAvatarByUserId,
  signup,
  login,
  resetPassword,
  askForNewPassword,
  reConfirmMyAccount,
  confirmAccount,
  errorController,
};
