import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Payment from "../models/payment.js";
import Client from "../models/client.js";

import dotenv from "dotenv";
dotenv.config();

export const countPaymentsOfCompany = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
    const count = await Payment.find({
      company: decodedToken.company,
    }).countDocuments();

    res.send({ count });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const countPaymentsOfUser = async (req, res) => {
  try {
    const count = await Payment.find({ createdBy: req.user }).countDocuments();
    res.send({ count });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const countPaymentsOfClient = async (req, res) => {
  try {
    const count = await Payment.find({
      client: req.body.client,
    }).countDocuments();
    res.send({ count });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllPaymentsOfCompany = async (req, res) => {
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
    const payments = await Payment.find({ company: decodedToken.company })
      .populate({
        path: "company",
        select: ["name"],
      })
      .populate({
        path: "createdBy",
        select: ["name", "user_roles"],
      })
      .populate({
        path: "client",
        select: ["firstName", "lastName", "remaining_credit"],
      })
      .limit(req.query.limit || 0)
      .skip(
        (req.query.limit || 0) * (req.query.page || 1) - (req.query.limit || 0)
      )
      .sort(sort);

    res.send({ payments });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllPaymentsOfUser = async (req, res) => {
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    const payments = await Payment.find({ createdBy: req.user })
      .populate({
        path: "client",
        select: ["firstName", "lastName", "remaining_credit"],
      })
      .populate({
        path: "createdBy",
        select: ["name", "user_roles"],
      })
      .populate({
        path: "company",
        select: ["name"],
      })
      .limit(req.query.limit || 0)
      .skip(
        (req.query.limit || 0) * (req.query.page || 1) - (req.query.limit || 0)
      )
      .sort(sort);

    res.send({ payments });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllPaymentsOfClient = async (req, res) => {
  const sort = {
    amount: 1,
  };
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    const payments = await Payment.find({ client: req.body.client })
      .populate({
        path: "createdBy",
        select: ["name", "user_roles"],
      })
      .populate({
        path: "company",
        select: ["name"],
      })
      .populate({
        path: "client",
        select: ["firstName", "lastName", "remaining_credit"],
      })
      .limit(req.query.limit || 0)
      .skip(
        (req.query.limit || 0) * (req.query.page || 1) - (req.query.limit || 0)
      )
      .sort(sort);

    res.send({ payments });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("client");
    res.status(200).send(payment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

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

export const updatePaymentInfo = async (req, res) => {
  try {
    const oldPayment = await Payment.findById(req.params.id);
    const updates = [
      ...oldPayment.updates,
      Object.keys(req.body).reduce(
        (acc, curr) => ({ ...acc, [curr]: oldPayment[curr] }),
        { updatedBy: req.user._id }
      ),
    ];
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      {
        ...req.body,
        updates,
        lastUpdatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    ).populate("client");

    res.send(payment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const deletePayment = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res
      .status(404)
      .send(`there is no payment with that id: ${req.params.id}`);
  try {
    const payment = await Payment.deleteOne({ id: req.params.id });
    res.status(200).send(payment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
