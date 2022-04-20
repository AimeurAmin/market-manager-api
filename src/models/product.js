import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  reference: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  qty_min: {
    type: Number,
    required: true,
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
  }
});

productSchema.virtual('barcodes', {
    ref: 'Barcode',
    localField: '_id',
    foreignField: 'product_id',
});

productSchema.virtual('stores', {
    ref: 'Stock',
    localField: '_id',
    foreignField: 'product_id',
});

const Product = mongoose.model('products', productSchema)

export default Product;