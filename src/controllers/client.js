import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Client from "../models/client.js";
import validateFields from "../helpers/validateFields.js";

import dotenv from "dotenv";
dotenv.config();
// ***************************************************************
export const countClientsOfCompany = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
    let client = await Client.find({
      company: decodedToken.company,
    }).countDocuments();
    res.send({ clients: client });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const countClientsOfUser = async (req, res) => {
  try {
    let count = await Client.find({ createdBy: req.user })
      .populate("createdBy")
      .countDocuments();
    res.send({ count: count });
  } catch (error) {
    res.status(400).send(error);
  }
};

// *************************************************************

export const getCompanyClients = async (req, res) => {
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
    const clients = await Client.find({
      company: decodedToken.company,
    })
      .populate({ path: "company", select: ["name"] })
      .populate({ path: "createdBy", select: ["name", "user_roles"] })
      .limit(req.query.limit || 0)
      .skip(
        (req.query.limit || 0) * (req.query.page || 0) - (req.query.limit || 0)
      )
      .sort(sort);

    res.send({ status: "success", result: clients.length, data: { clients } });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllClientsOfUser = async (req, res) => {
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === desc ? -1 : 1;
  }
  try {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
    const clients = await Client.find({ createdBy: decodedToken._id })
      .populate({ path: "createdBy", select: ["name", "user_roles"] })
      .limit(req.query.limit || 0)
      .skip(
        (req.query.limit || 0) * (req.query.page || 0) - (req.query.limit || 0)
      )
      .sort(sort);

    res.json({ status: "success", result: clients.length, data: { clients } });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      throw new Error("client not found");
    }
    res.send(client);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const addClient = async (req, res) => {
  const client = new Client({
    ...req.body,
    createdBy: req.user._id,
    company: req.user.company,
  });
  try {
    client.updates = [
      ...client.updates,
      { ...req.body, updatedBy: req.user._id },
    ];
    await client.save();
    res.status(201).send(client);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const updateClientInfo = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Client with id: ${id}`);

  const allowedUpdates = [
    "firstName",
    "lastName",
    "phone",
    "address",
    "limit_credit",
    "payment_dead_line",
    "remaining_credit",
  ];
  const requiredFields = [];

  const { invalidFields, missingFields } = validateFields(
    allowedUpdates,
    requiredFields,
    req.body
  );

  if (invalidFields.length > 0)
    return res.status(400).send({
      error: `the following fields are invalid: ${invalidFields} | and the following fields are required: ${missingFields}`,
      invalidFields,
      missingFields,
    });

  try {
    const client = await Client.findOneAndUpdate(
      { _id: id, company: req.user.company },
      { ...req.body, lastUpdatedBy: req.user._id },
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).send({ error: `client not found! `, status: 404 });
    }
    res.send(client);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!client) {
      return res.status(404).send({ error: `client not found! `, status: 404 });
    }

    res.status(204).send({ status: "success" });
  } catch (error) {
    res.status(400).send(error);
  }
};
