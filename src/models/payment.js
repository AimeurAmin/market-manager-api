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
    throw new Error("the amount must be > 0 ");
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

paymentSchema.post("remove", async function (payment) {});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
