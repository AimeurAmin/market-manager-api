import mongoose from 'mongoose';

const permissionSchema = mongoose.Schema({
  permit_name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Role',
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
});

const Permission = mongoose.model('permissions', permissionSchema)

export default Permission;