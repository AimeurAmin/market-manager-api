import Client from "../models/client.js";
import Company from "../models/company.js"
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

export const updateInfoClient = async(req, res) => {

}
export const deleteClient = async(req, res) => {

}