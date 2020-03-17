const mongoose = require("mongoose");

const regEmail = RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

const OrderSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!regEmail.test(value)) {
        throw new Error("Provide Valid Email");
      }
    }
  },
  contact: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true
  },
  products: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  total: {
    type: "Number",
    required: true
  }
});

OrderSchema.methods.addProducts = async function (products) {
  const order = this;
  console.log(products);
  products.products.forEach(product => {
    const index = products.products.indexOf(product);
    order.products = order.products.concat(products.products[index]);
  });

  const response = await order.save();
  console.log(response);
  return response;
};

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
