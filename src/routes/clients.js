import express from 'express';
import { addClient, deleteClient, getAllClients, getClientById, updateInfoClient } from '../controllers/client.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET ALL CLIENTS
router.get('/', auth, getAllClients);

// GET CLIENT BY ID 
router.get('/:id', auth, getClientById);

// ADD CLIENT 
router.post('/', auth, addClient);

// UPDATE CLIENT INFO
router.patch('/:id', auth, updateInfoClient);

// DELETE CLIENT 
router.delete('/:id', auth, deleteClient);

export default router;
