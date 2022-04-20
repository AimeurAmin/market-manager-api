import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Client'
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
    trim: true
  },
  createdBy: {
        type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  company_id: {
        type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  timestamps: {
    type: Date,
    default: Date.now()
  },
})

const Payment = mongoose.model('payments', paymentSchema)

export default Payment;