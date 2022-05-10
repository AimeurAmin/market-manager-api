import {
  addClient,
  countClientsOfCompany,
  countClientsOfUser,
  deleteClient,
  getAllClientsOfUser,
  getClientById,
  getCompanyClients,
  updateClientInfo,
} from "../controllers/client.js";
import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

// COUNT ALL CLIENT OF COMPANY
router.get("/countClientsOfCompany", auth, countClientsOfCompany);

// COUNT ALL CLIENT OF SPECIFIC USER
router.get("/countClientsOfUser", auth, countClientsOfUser);

// GET ALL CLIENT OF COMPANY
router.get("/companyClients", auth, getCompanyClients);

// GET ALL CLIENTS OF USER
router.get("/userClients", auth, getAllClientsOfUser);

// GET CLIENT BY ID
router.get("/:id", auth, getClientById);

// ADD CLIENT
router.post("/", auth, addClient);

// UPDATE CLIENT INFO
router.patch("/:id", auth, updateClientInfo);

// DELETE CLIENT
router.delete("/:id", auth, deleteClient);

export default router;
