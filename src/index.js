const express = require("express");
const mongoose = require("mongoose");
const ProductRouter = require("./routes/Products");
const CategoryRouter = require("./routes/Categories");
const OrderRouter = require("./routes/Orders");
const UserRouter = require("./routes/Users");
const SalesRouter = require("./routes/Sales");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(cors());
const port = process.env.PORT;
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


mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

app.listen(port, () => {
  console.log("Server is Listening at Port:" + port);
});
