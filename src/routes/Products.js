const express = require("express");
const multer = require("multer");
const router = express.Router();
const Product = require("../models/Products");
const Category = require("../models/Categories");

const storage = multer.diskStorage({
  destination: "./products_images/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb("Please Upload an Image file", false);
    }
  }
});

router.post("/products", upload.single("product_image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const product_category = req.body.product_category;
    const category = await Category.findOne({
      category_name: product_category
    });
    console.log(category._id);
    const product = new Product({
      product_name: req.body.product_name,
      product_unit_price: req.body.product_unit_price,
      product_brand: req.body.product_brand,
      product_category: category._id,
      product_color: req.body.product_color,
      product_description: req.body.product_description,
      product_quantity: req.body.product_quantity,
      product_image: imagePath
    });

    const productt = await product.save();

    if (!productt) {
      res.status(401).send();
    }
    productt.product_image = productt.product_image.replace(
      "products_images\\",
      "http://localhost:3001/products_images/"
    );
    res.status(201).send(productt);
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      res.status(401).send();
    }
    products.forEach(product => {
      product.product_image = product.product_image.replace(
        "products_images\\",
        "http://localhost:3001/products_images/"
      );
    });
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/products/:searchTerm", async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const products = await Product.find({ product_name: searchTerm });
    if (!products) {
      res.status(401).send();
    }
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
  res.send();
});

router.get("/products/category/:category", async (req, res) => {
  try {
    const requested_category = req.params.category;
    console.log(requested_category);
    const category = await Category.findOne({
      category_name: requested_category
    });
    await category.populate("Product").execPopulate();
    var products = category.Product;
    products.forEach(product => {
      product.product_image = product.product_image.replace(
        "products_images\\",
        "http://localhost:3001/products_images/"
      );
    });
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/product/category/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    console.log(category);
    res.send(category.category_name);
  } catch (err) {
    res.status(500).send();
  }
});

router.patch("/products", async (req, res) => {
  try {
    // console.log(req.body);
    const promises = req.body.map(async product => {
      // console.log(product.quantity);
      // console.log(product.product_id);
      const prod = await Product.findById(product.product_id);
      // console.log(prod.product_quantity);
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: product.product_id },
        { product_quantity: prod.product_quantity - product.quantity },
        {
          new: true,
          runValidators: true
        }
      );
      // console.log(updatedProduct);
      if (updatedProduct.product_quantity < 1) {
        await Product.findByIdAndDelete(product.product_id);
        return "Product Removed";
      }
      return updatedProduct;
    });
    Promise.all(promises).then(response => {
      // console.log(response);
      if (!response) {
        res.status(401).send();
      }
      res.send(response);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
