import express from "express";
import auth from "../middleware/auth.js";

import {
  addPayment,
  countPayment,
  deletePayment,
  getAllPayments,
  getCompanyPayments,
  getPaymentById,
  updatePaymentInfo,
} from "../controllers/payments.js";

const router = express.Router();

// COUNT ALL CLIENT
router.get("/count", countPayment);

// GET ALL CLIENT OF COMPANY
router.get("/companyClients", auth, getCompanyPayments);

// GET ALL CLIENTS
router.get("/", auth, getAllPayments);

// GET CLIENT BY ID
router.get("/:id", auth, getPaymentById);

// ADD CLIENT
router.post("/client", auth, addPayment);

// UPDATE CLIENT INFO
router.patch("/:id", auth, updatePaymentInfo);

// DELETE CLIENT
router.delete("/:id", auth, deletePayment);

export default router;
