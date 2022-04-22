import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema({
  total: {
    type: Number,
    default: 0,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    default: undefined,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  timestamps: {
    type: Date,
    default: Date.now(),
  },
});

invoiceSchema.virtual("sales", {
  ref: "Sale",
  localField: "_id",
  foreignField: "invoice",
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
