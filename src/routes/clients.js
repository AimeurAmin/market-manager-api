import {
  addClient,
  countClients,
  deleteClient,
  getAllClients,
  getClientById,
  getCompanyClients,
  updateClientInfo,
} from "../controllers/client.js";
import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

// COUNT ALL CLIENT
router.get("/count", countClients);

// GET ALL CLIENT OF COMPANY
router.get("/companyClients", auth, getCompanyClients);

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

export default router;
