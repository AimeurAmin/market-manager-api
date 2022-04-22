import dotenv from "dotenv";
import Payment from "../models/payment.js";
dotenv.config();

export const countPayment = async (req, res) => {};
export const getCompanyPayments = async (req, res) => {};
export const getAllPayments = async (req, res) => {};
export const getPaymentById = async (req, res) => {};
export const addPayment = async (req, res) => {
  if (!req.user._id) return res.status(401).send("Unauthenticated");
  const payment = new Payment({
    ...req.body,
    createdBy: req.user._id,
    company: req.user.company,
  });

  try {
    await payment.save();
    res.status(201).send(payment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
export const updatePaymentInfo = async (req, res) => {};
export const deletePayment = async (req, res) => {};
