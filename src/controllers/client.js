import Client from "../models/client.js";
import Company from "../models/company.js";
import validateFields from "../helpers/validateFields.js";
import mongoose from 'mongoose';

import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

export const getAllClients = async(req, res) => {
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === desc ? -1 : 1
    }
    try {
        const clients = await Client.find()
            .populate("createdBy")
            .limit(req.query.limit || 0)
            .skip((req.query.limit || 0) * (req.query.page || 0) - (req.query.limit || 0))
            .sort(sort);

        res.send(clients);
    } catch (error) {
        res.status(400).send(error)
    }
}

export const getClientById = async(req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        res.send(client);
    } catch (error) {
        res.status(400).send(error);
    }
}


export const addClient = async(req, res) => {
    const client = new Client({
        ...req.body,
        createdBy: req.user._id,
        company: req.user.company
    });
    try {
        await client.save();
        res.send(client);

    } catch (err) {
        res.status(400).send(err);
    }
}

export const updateClientInfo = async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Client with id: ${id}`);

    const allowedUpdates = ["firstName", "lastName", "phone", "address", "limit_credit", "payment_dead_line"];
    const requiredFields = [];

    const { invalidFields, missingFields } = validateFields(allowedUpdates, requiredFields, req.body);

    if (invalidFields.length > 0)
        return res.status(400).send({
            error: `the following fields are invalid: ${invalidFields} | and the following fields are required: ${missingFields}`,
            invalidFields,
            missingFields
        });

    try {
        const client = await Client.findOneAndUpdate({ id, createdBy: req.user._id }, req.body, { new: true, runValidators: true });
        if (!client) return res.status(404).send({ error: `client not found! `, status: 404 });
        res.send(client);
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteClient = async(req, res) => {
    try {
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!client) {
            return res.status(404).send({ error: `client not found! `, status: 404 });
        }

        res.send(client);
    } catch (error) {
        res.status(400).send(error)
    }

}

export const countClients = async(req, res) => {
    try {
        let count = await Client.countDocuments();
        res.send({ count });
    } catch (error) {
        res.status(400).send(error);
    }
};


export const getCompanyClients = async(req, res) => {
    const token = req.token;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const company = await Company.findById(decodedToken.company).populate("clients");
        res.send({ clients: company.clients });

    } catch (error) {
        res.status(400).send(error);
    }
}