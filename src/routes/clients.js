import express from 'express';
import { addClient, countClients, deleteClient, getAllClients, getClientById, getCompanyClients, updateClientInfo } from '../controllers/client.js';
import auth from '../middleware/auth.js';
import jwt from "jsonwebtoken";
import Company from '../models/company.js';

const router = express.Router();

// GET ALL CLIENTS
router.get("/", auth, getAllClients);

// GET CLIENT BY ID 
router.get("/:id", auth, getClientById);

// ADD CLIENT 
router.post("/", auth, addClient);

// UPDATE CLIENT INFO
router.patch("/:id", auth, updateClientInfo);

// DELETE CLIENT 
router.delete("/:id", auth, deleteClient);

// COUNT ALL CLIENT
router.get("/count", countClients);

// GET ALL CLIENT OF COMPANY
router.get("/companyClients", auth, getCompanyClients);

export default router;