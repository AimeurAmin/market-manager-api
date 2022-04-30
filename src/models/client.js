import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  limit_credit: {
    type: Number,
    default: 0,
  },
  remaining_credit: {
    type: Number,
    default: 0,
  },
  payment_dead_line: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updates: [
    {
      lastName: {
        type: String,
      },
      firstName: {
        type: String,
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      limit_credit: {
        type: Number,
        default: 0,
      },
      remaining_credit: {
        type: Number,
        default: 0,
      },
      payment_dead_line: {
        type: Date,
        default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      timestamps: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
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

clientSchema.virtual("invoices", {
  ref: "Invoice",
  localField: "_id",
  foreignField: "client",
});

clientSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "client",
});

// clientSchema.pre("save", async function (next) {
//   const client = this;
//   const existPhone = await Client.findOne({ phone: client.phone });
//   if (existPhone) {
//     throw new Error("the client exist in our store");
//   }
//   next();
// });

clientSchema.post(/findOneAndUpdate/, async function (client) {
  client.updates = [
    ...client.updates,
    { ...client, updatedBy: client.lastUpdatedBy },
  ];

  await client.save();
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
