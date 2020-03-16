const mongoose = require("mongoose");

const SalesSchema = mongoose.Schema(
  {
    product_id: {
      type: String,
      trim: true,
      required: true
    },
    category: {
      type: String,
      trim: true,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    sale_price: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Sales = mongoose.model("Sales", SalesSchema);

module.exports = Sales;
