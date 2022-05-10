import express from "express";
import {
  addProduct,
  countProductCompany,
  deleteProduct,
  getCompanyProducts,
  getProductByBarcode,
  getProductById,
  updateProductInfo,
} from "../controllers/products.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// COUNT ALL Products OF COMPANY
router.get("/countProductCompany", auth, countProductCompany);

// GET ALL Products OF COMPANY
router.get("/companyProducts", auth, getCompanyProducts);

// GET Product BY ID
router.get("/:id", auth, getProductById);

// GET Product by Barcode
router.get("/barcode/:barcode", auth, getProductByBarcode);

// ADD Product
router.post("/", auth, addProduct);

// UPDATE Product INFO
router.patch("/:id", auth, updateProductInfo);

// DELETE PRODUCT
router.delete("/:id", auth, deleteProduct);

export default router;
