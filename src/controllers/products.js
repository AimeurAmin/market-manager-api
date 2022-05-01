import Product from "../models/product.js";

export const countProductCompany = async (req, res) => {};
export const getCompanyProducts = async (req, res) => {
  try {
    const productsCompany = await Product.find({ company: req.user.company });
    res.status(200).send(productsCompany);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
export const getProductById = async (req, res) => {};
export const getProductByBarcode = async (req, res) => {};
export const addProduct = async (req, res) => {
  const product = new Product({
    ...req.body,
    createdBy: req.user._id,
    company: req.user.company,
  });
  console.log(req.body);
  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
export const updateProductInfo = async (req, res) => {
  try {
  } catch (error) {
    res.status(400).send(error.message);
  }
};
export const deleteProduct = async (req, res) => {};
