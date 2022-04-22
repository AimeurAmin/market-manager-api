import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  limit_credit: {
    type: Number,
    default: 0,
  },
  remaining_credit: {
    type: Number,
    default: 0,
  },
  payment_dead_line: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
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

clientSchema.virtual("invoices", {
  ref: "Invoice",
  localField: "_id",
  foreignField: "client",
});

clientSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "client",
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
