import Client from '../models/client.js'
export const getAllClients = async (req, res) => {
  const client = new Client({
    ...req.body,
    owner: req.user._id,
    company: req.user.company
  });
  try {
    await client.save();
    res.send(client);
    
  } catch (err) {
    res.status(400).send(err);
  }
}

export const getClientById = async (req, res) => {
  
}

export const addClient = async (req, res) => {
  
}

export const updateInfoClient = async (req, res) => {
  
}
export const deleteClient = async (req, res) => {
  
}




