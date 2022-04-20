import express from 'express';
import { addClient, deleteClient, getAllClients, getClientById, updateInfoClient } from '../controllers/client.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// get all client from our dataBase
router.get('/', auth, getAllClients);

// get specific client from our DataBase
router.get('/:id', auth, getClientById);

// add new Client to take credit 
router.post('/', auth, addClient);

// edit info of client 
router.patch('/:id', auth, updateInfoClient);

// deleteClientWithRemaining-amount equal 0
router.delete('/:id', auth, deleteClient);

export default router;
