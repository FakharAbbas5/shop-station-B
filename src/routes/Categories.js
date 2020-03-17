const express = require("express");
const Category = require("../models/Categories");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./categories_images/",
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
      cb("Please Upload an Image File", false);
    }
  }
});

router.post(
  "/categories",
  upload.single("category_image"),
  async (req, res) => {
    try {
      const imagePath = req.file.path;
      console.log(imagePath);
      const category = new Category({
        ...req.body,
        category_image: imagePath
      });

      const response = await category.save();
      if (!response) {
        res.status(401).send();
      }
      response.category_image = response.category_image.replace(
        "categories_images\\",
        "http://localhost:3001/categories_images/"
      );
      res.status(201).send(response);
    } catch (err) {
      res.status(500).send();
    }
  }
);
router.get("/categories/:cat", async (req, res) => {
  try {
    const response = await Category.findOne({ category_name: req.params.cat });
    if (!response) {
      res.status(401).send();
    }
    // console.log(response);
    response.category_image = response.category_image.replace(
      "categories_images\\",
      "http://localhost:3001/categories_images/"
    );
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
