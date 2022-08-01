import express from "express";
import {
  addProduct,
  countProductCompany,
  deleteBarcodeFromProduct,
  deleteProduct,
  getCompanyProducts,
  getProductByBarcode,
  getProductById,
  updateProductInfo,
} from "../controllers/products.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// COUNT ALL Products OF COMPANY
router.get("/count", auth, countProductCompany);

// router.get("/countProducts", auth, countProductUser);

// router.get("/")

// GET ALL Products OF COMPANY
router.get("/", auth, getCompanyProducts);

// GET Product by Barcode
router.get("/barcode/:barcode", auth, getProductByBarcode);

// GET Product BY ID
router.get("/:id", auth, getProductById);

// ADD Product
router.post("/", auth, addProduct);

// UPDATE Product INFO
router.patch("/:id", auth, updateProductInfo);

// DELETE PRODUCT
router.delete("/:id", auth, deleteProduct);

// DELETE BARCODE of wrong product
router.delete("/barcode/:barcode", auth, deleteBarcodeFromProduct);

export default router;
