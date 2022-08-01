import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  reference: {
    type: String,
  },
  type: {
    type: String,
  },
  category: {
    type: String,
  },
  brand: {
    type: String,
  },
  qty_min: {
    type: Number,
    required: true,
  },
  barcodes: [
    {
      barcode: {
        type: String,
        unique: true,
      },
    },
  ],
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updates: [
    {
      reference: { type: String },
      type: { type: String },
      category: { type: String },
      brand: { type: String },
      qty_min: {
        type: Number,
      },
      barcodes: [
        {
          barcode: {
            type: String,
          },
        },
      ],
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

// productSchema.virtual("barcodes", {
//   ref: "Barcode",
//   localField: "_id",
//   foreignField: "product",
// });

productSchema.virtual("stores", {
  ref: "Stock",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre("save", async function (next) {
  const product = this;
  const found = await Product.findOne({
    reference: product.reference,
    category: product.category,
  });
  if (found) {
    throw new Error(
      `errorMessage: reference (${found.reference}) && category (${found.category}) already taken!`
    );
  }
  let exists;
  let arr = [];
  await Promise.all(
    product.barcodes.map(async (barcode) => {
      exists = await Product.findOne({
        "barcodes.barcode": barcode.barcode,
      });
      if (exists) {
        arr.push(barcode.barcode);
      }
    })
  );
  if (arr.length > 0) {
    throw new Error(`${arr}`);
  }
  next();
});

productSchema.pre(/findOneAndUpdate/, async function (next) {
  const product = this;

  let exists;
  let arr = [];
  await Promise.all(
    product._update.barcodes?.map(async (barcode) => {
      exists = await Product.findOne({
        "barcodes.barcode": barcode.barcode,
      });
      if (exists) {
        arr.push(barcode.barcode);
      }
    })
  );
  if (arr.length > 0) {
    throw new Error(`${arr}`);
  }
  next();
});
// productSchema.post(/findOneAndUpdate/, async function (product) {
//   product.updates = [
//     ...product.updates,
//     { ...product, updatedBy: product.lastUpdatedBy },
//   ];
//
//   await product.save();
// });

productSchema.post("remove", async function (product) {});

const Product = mongoose.model("Product", productSchema);

export default Product;
