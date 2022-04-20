import mongoose from 'mongoose';

const saleSchema = mongoose.Schema({
  stock_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Stock'
  },
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Invoice'
  },
  qty_sold: {
    type: Number,
    required: true,
    default: 1
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
    default: Date.now()
  }
})

const Sale = mongoose.model('sales', saleSchema);

export default Sale;