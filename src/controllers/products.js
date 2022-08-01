import Product from "../models/product.js";

export const countProductCompany = async (req, res) => {
  try {
    const countProducts = await Product.find({
      company: req.user.company,
    }).countDocuments();
    res.status(200).send({ count: countProducts });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const getCompanyProducts = async (req, res) => {
  try {
    const productsCompany = await Product.find({ company: req.user.company });
    res.status(200).send(productsCompany);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({
      "barcodes.barcode": req.params.barcode,
    });
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const addProduct = async (req, res) => {
  if (!req.user._id) return res.status(401).send("Unauthenticated");
  const product = new Product({
    ...req.body,
    createdBy: req.user._id,
    company: req.user.company,
    barcodes: [...new Set(req.body.barcodes)].map((barcode) => ({ barcode })),
  });
  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    if (error.message.split(":")[0] === "errorMessage") {
      return res.status(400).send({
        message: error.message.split(":")[1],
      });
    }
    res.status(400).send({
      count: error.message.split(",").length,
      message: "these barcodes are duplicated!",
      barcodes: error.message.split(","),
    });
  }
};

export const updateProductInfo = async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);
    const updates = [
      ...oldProduct.updates,
      {
        ...Object.keys(req.body).reduce(
          (acc, curr) =>
            oldProduct[curr] !== req.body[curr]
              ? {
                  ...acc,
                  [curr]: oldProduct[curr],
                }
              : acc,
          { updatedBy: req.user._id }
        ),
      },
    ];

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
        lastUpdatedBy: req.user._id,
        barcodes: [...new Set(req.body.barcodes)].map((barcode) => ({
          barcode,
        })),
        updates,
      },
      { new: true, runValidators: true }
    );

    res.status(200).send(JSON.parse(JSON.stringify(product)));
  } catch (error) {
    if (error.message.split(":")[0] === "errorMessage") {
      return res.status(400).send({
        message: error.message.split(":")[1],
      });
    }
    res.status(400).send({
      count: error.message.split(",").length,
      message: "these barcodes are duplicated!",
      barcodes: error.message.split(","),
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.find(req.params.id);
    res.status(200).send();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const deleteBarcodeFromProduct = async (req, res) => {
  try {
    const barcodes = await Product.findById(req.params.id);
    await barcodes.remove();
    res.status(200).send();
  } catch (err) {
    res.status(400).send(err.message);
  }
};
