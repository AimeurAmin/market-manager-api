import express from "express";
import auth from "../middleware/auth.js";

import {
  addPayment,
  countPaymentsOfClient,
  countPaymentsOfCompany,
  countPaymentsOfUser,
  deletePayment,
  getAllPaymentsOfClient,
  getAllPaymentsOfCompany,
  getAllPaymentsOfUser,
  getPaymentById,
  updatePaymentInfo,
} from "../controllers/payments.js";

const router = express.Router();

// COUNT ALL PAYMENTS OF COMPANY
router.get("/countPaymentCompany", auth, countPaymentsOfCompany);

// COUNT ALL PAYMENTS OF USER
router.get("/countPaymentsUser", auth, countPaymentsOfUser);

// COUNT ALL PAYMENTS CLIENT
router.get("/countPaymentsClient", auth, countPaymentsOfClient);

// GET ALL PAYMENTS OF COMPANY
router.get("/companyPayments", auth, getAllPaymentsOfCompany);

// GET ALL PAYEMNTS OF USER
router.get("/userPayments", auth, getAllPaymentsOfUser);

// GET ALL PAYMENTS OF CLIENT
router.get("/clientPayments", auth, getAllPaymentsOfClient);

// GET CLIENT BY ID
router.get("/:id", auth, getPaymentById);

// ADD CLIENT
router.post("/client", auth, addPayment);

// UPDATE CLIENT INFO
router.patch("/:id", auth, updatePaymentInfo);

// DELETE CLIENT
router.delete("/:id", auth, deletePayment);

export default router;
