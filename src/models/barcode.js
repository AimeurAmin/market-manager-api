import mongoose from "mongoose";

const barcodeSchema = mongoose.Schema({
  barcode: {
    type: String,
    unique: true,
    trim: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  },
  timestamps: {
    type: Date,
    default: Date.now()
  },
});

const Barcode = mongoose.model('barcodes', barcodeSchema)

export default Barcode;