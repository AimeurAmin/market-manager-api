import mongoose from 'mongoose';

const clientSchema = mongoose.Schema({
  lastName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  limit_credit: {
    type: Number,
    default: 0
  },
  remaining_credit: {
    type: Number,
    default: 0
  },
  payment_dead_line: {
    type: Number,
    default: 0,
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

clientSchema.virtual('invoices', {
    ref: 'Invoice',
    localField: '_id',
    foreignField: 'client_id',
});

clientSchema.virtual('payments', {
    ref: 'Payment',
    localField: '_id',
    foreignField: 'client_id',
});

const Client = mongoose.model('clients', clientSchema);

export default Client;