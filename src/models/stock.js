import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
  purchase_price: {
    type: Number,
    required: true,
  },
  selling_price: {
    type: Number,
    required: true,
  },
  stock_qty: {
    type: Number,
    required: true,
  },
  initial_qty: {
    type: Number,
  },
  promo: {
    type: Number,
  },
  expiry_date: {
    type: Date,
    default: null,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
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

stockSchema.virtual("sales", {
  ref: "Sale",
  localField: "_id",
  foreignField: "stock_id",
});

const Stock = mongoose.model("stock", stockSchema);

export default Stock;
