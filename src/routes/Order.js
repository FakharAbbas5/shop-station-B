const express = require("express");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const auth = require("../Middleware/Auth");
const router = express.Router();


const calculateTotals = (products) => {
  const productsTotalsPromises = products.map(async product => {
    const productRes = await Product.findById(product._id);
    return productRes.product_unit_price * product.quantity;
  });

  Promise.all(productsTotalsPromises).then(response => {
    const total = response.reduce((a, b) => {
      return a + b
    });
    console.log(total)
  })
}

router.post("/orders", async (req, res) => {
  try {

    const productsTotalsPromises = req.body.products.map(async product => {
      const productRes = await Product.findById(product._id);
      return productRes.product_unit_price * product.quantity;
    });
    console.log(productsTotalsPromises)
    Promise.all(productsTotalsPromises).then(async response => {
      const total = response.reduce((a, b) => {
        return a + b
      });
      console.log(total)
      const order = new Order({
        fullname: req.body.customer_name,
        email: req.body.customer_email,
        contact: req.body.customer_contact,
        shippingAddress: req.body.customer_shipping_address,
        products: req.body.products,
        total
      });
      const norder = await order.save();
      console.log(norder);
      // const myOrder = await norder.addProducts(req.body);
      if (!norder) {
        // console.log("FAiling");
        return res.status(401).send();
      }
      res.status(201).send(norder);
    });

  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find();
    console.log(orders);
    if (!orders) {
      res.status(401).send();
    }
    // console.log("HHHH");
    res.send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/orders/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(401).send();
    }

    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/order/products/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const products = order.products;
    console.log(products);
    var newProds = [];
    var someData;
    const promises = products.map(async product => {
      const prod = await Product.findById(product._id);
      prod.product_image = prod.product_image.replace(
        "products_images\\",
        "http://localhost:3001/products_images/"
      );
      return prod;
    });
    Promise.all(promises).then(response => {
      console.log(response);
      if (!res) {
        res.status(401).send();
      }
      res.send(response);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
