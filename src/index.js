const express = require("express");
const mongoose = require("mongoose");
const ProductRouter = require("./routes/Product");
const CategoryRouter = require("./routes/Category");
const OrderRouter = require("./routes/Order");
const UserRouter = require("./routes/User");
const SalesRouter = require("./routes/Sales");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(cors());
const port = process.env.PORT || 3001;
app.use(express.json());

app.use("/products_images", express.static("products_images"));
app.use("/categories_images", express.static("categories_images"));
app.use(ProductRouter);
app.use(CategoryRouter);
app.use(OrderRouter);
app.use(UserRouter);
app.use(SalesRouter);

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/shop-station-db", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

app.listen(port, () => {
  console.log("Server is Listening at Port:" + port);
});
