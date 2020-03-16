const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      trim: true,
      required: true
    },
    product_brand: {
      type: String,
      trim: true,
      default: "Shop Station"
    },
    product_size: {
      type: String,
      default: 0,
      trim: true,
      validate(value) {
        if (value < 0) {
          throw new Error("Product size must be Greater Then 0");
        }
      }
    },
    product_unit_price: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
        if (value < 0) {
          throw new Error("Please Enter a Positive Number");
        }
      }
    },
    product_color: {
      type: String,
      trim: true
    },
    product_description: {
      type: String,
      required: true,
      trim: true
    },
    product_image: {
      type: String,
      required: true,
      trim: true
    },
    product_quantity: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
        if (value < 0) {
          throw new Error("Please Enter Positive Number");
        }
      }
    },
    product_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
