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
        default: undefined,
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
  console.log(product);
  // const docToUpdate = await this.model.findOne(this.getQuery());
  const existsBarcode = await Product.find({
    "barcodes.barcode": product.barcodes.barcode,
  });
  console.log(existsBarcode);
  // if (existsBarcode) {
  //   throw new Error("the barcode exists in our store");
  // }

  next();
});

productSchema.index({ reference: 1 }, { unique: true });

const Product = mongoose.model("products", productSchema);

export default Product;
