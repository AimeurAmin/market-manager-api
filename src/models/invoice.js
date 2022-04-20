import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: undefined,
  },
  total: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: undefined,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: undefined,
  },
  timestamps: {
    type: Date,
    default: Date.now(),
  },
});

invoiceSchema.virtual("sales", {
  ref: "Sale",
  localField: "_id",
  foreignField: "invoice_id",
});

const Invoice = mongoose.model("invoices", invoiceSchema);

export default Invoice;
