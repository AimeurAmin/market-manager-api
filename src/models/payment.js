import mongoose from "mongoose";
import Client from "./client.js";

const paymentSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    default: 0,
    trim: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  timestamps: {
    type: Date,
    default: Date.now(),
  },
});

paymentSchema.pre("save", async function (next) {
  const payment = this;
  if (payment.amount <= 0) {
    throw new Error("the amount must be > 0");
  }
  const client = await Client.findById(payment.client);
  if (client.remaining_credit === 0) {
    throw new Error("there is no unpaid amount for this client");
  }

  if (client.remaining_credit - payment.amount < 0) {
    throw new Error(
      `the amount exceeded the unpaind amount, ${client.remaining_credit}`
    );
  }

  next();
});

paymentSchema.post("save", async function (payment) {
  const client = await Client.findById(payment.client);

  client.remaining_credit = client.remaining_credit - payment.amount;

  try {
    await client.save();
  } catch (error) {
    throw new Error(error);
  }
});

paymentSchema.pre(/findOneAndUpdate/, async function (next) {
  const payment = this;
  const docToUpdate = await this.model
    .findOne(this.getQuery())
    .populate("client");
  const client = docToUpdate.client;
  const newAmount = payment._update.amount;
  if (!payment._update.client) {
    client.remaining_credit += docToUpdate.amount - newAmount;
  } else {
    const newClient = await Client.findById(payment._update.client);
    newClient.remaining_credit -= newAmount ? newAmount : docToUpdate.amount;
    client.remaining_credit += docToUpdate.amount;
    await newClient.save();
  }

  await client.save();
  next();
});

paymentSchema.pre("remove", async function (next) {
  const payment = this;
  const client = await Client.findById(payment.client);
  if (!mongoose.Types.ObjectId.isValid(client._id)) {
    throw new Error(`there is no client with that id: ${client._id}`);
  }
  next();
});

paymentSchema.post("remove", async function (payment) {
  const client = await Client.findById(payment.client);
  client.remaining_credit = client.remaining_credit + payment.amount;

  try {
    await client.save();
  } catch (error) {
    throw new Error(error.message);
  }
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
