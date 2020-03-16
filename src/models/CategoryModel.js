const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        trim: true
    },
    category_description: {
        type: String,
        required: true,
        trim: true
    },
    category_image: {
        type: String,
        required: true,
        trim: true
    },
    category_isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


CategorySchema.virtual("Product", {
    ref: "Product",
    localField: "_id",
    foreignField: "product_category"
})

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;