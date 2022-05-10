// import mongoose from "mongoose";
//
// const barcodeSchema = mongoose.Schema({
//   barcode: {
//     type: String,
//     unique: true,
//     trim: true,
//   },
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "Product",
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
//   company: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "Company",
//   },
//   timestamps: {
//     type: Date,
//     default: Date.now(),
//   },
// });
//
// barcodeSchema.index({ barcode: 1 }, { unique: true });
//
// const Barcode = mongoose.model("Barcode", barcodeSchema);
//
// export default Barcode;
