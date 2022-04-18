const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");
const { welcomeMail } = require("../emails/welcome-email");
const { resetPasswordMail } = require("../emails/rest-password-email");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      default: undefined,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function (params) {
  const user = this.toObject();

  const { tokens, password, ...userPublicData } = user;

  return userPublicData;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const correctCridentials = await bcrypt.compare(password, user.password);

  if (!correctCridentials) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1 days",
  });

  user.tokens = [...user.tokens, { token }];

  await user.save();

  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.post("save", async function (user) {
  if (user?.tokens[0]?.token && !user.confirmed) {
    welcomeMail(user.email, user.name, user.tokens[0]?.token);
  } else if (user.confirmed && user.resetToken) {
    console.log("rani b3atht");
    resetPasswordMail(user.email, user.name, user.resetToken);
  }
});

userSchema.pre(/findOneAndUpdate/, async function (next) {
  const user = this;

  if (user._update.password) {
    user._update.password = await bcrypt.hash(user._update.password, 8);
  }

  next();
});

userSchema.post(/findOneAndDelete/, async function () {
  const user = this;

  await Task.deleteMany({ owner: user._conditions._id });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
