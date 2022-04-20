import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
  role_name: {
    type: String,
    required: true,
    default: "user",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  role_permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
  timestamps: {
    type: Date,
    default: Date.now(),
  },
});

roleSchema.virtual("permissions", {
  ref: "Permission",
  localField: "_id",
  foreignField: "role_id",
});

const Role = mongoose.model("roles", roleSchema);

export default Role;
