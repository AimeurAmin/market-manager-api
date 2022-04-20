import mongoose from 'mongoose';

const stockSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  purchase_price: {
    type: Number,
    required: true
  },
  selling_price: {
    type: Number,
    required: true
  },
  stock_qty: {
    type: Number,
    required: true
  },
  initial_qty: {
    type: Number,
  },
  promo: {
    type: Number,
  },
  expiry_date: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  },
  timestamps: {
    type: Date,
    default: Date.now(),
  }
});

productSchema.virtual('sales', {
    ref: 'Sale',
    localField: '_id',
    foreignField: 'stock_id',
});



const Stock = mongoose.model('stock', stockSchema);

export default Stock;