const express = require("express");
const Sales = require("../models/Sales");
const router = express.Router();

router.get("/sales", async (req, res) => {
  res.send("Hellll");
});

router.post("/sales", async (req, res) => {
  try {
    console.log("BLoody Hell");
    var index = 0;
    const salesPromises = req.body.map(async product => {
      const sales = new Sales({
        ...product
      });
      const sale = await sales.save();
      return sale;
    });

    Promise.all(salesPromises).then(response => {
      if (!response) {
        res.status(401).send();
      }
      res.send(response);
    });
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/SalesByCategories", async (req, res) => {
  try {
    const Electronics = await Sales.find({ category: "Electronics" });
    const Fashion = await Sales.find({ category: "Fashion" });
    const Books = await Sales.find({ category: "Books" });
    const Grocery = await Sales.find({ category: "Grocery" });
    const ElectronicSales = Electronics.map(product => {
      return product.sale_price;
    });
    const ElectronicsSum = ElectronicSales.reduce((a, b) => {
      return a + b;
    }, 0);
    const FashionSales = Fashion.map(product => {
      return product.sale_price;
    });

    const FashionSum = FashionSales.reduce((a, b) => {
      return a + b;
    }, 0);

    const BooksSales = Books.map(product => {
      return product.sale_price;
    });

    const BooksSum = BooksSales.reduce((a, b) => {
      return a + b;
    }, 0);
    const GrocerySales = Grocery.map(product => {
      return product.sale_price;
    });
    const GrocerySum = GrocerySales.reduce((a, b) => {
      return a + b;
    }, 0);
    console.log(ElectronicsSum);
    res.send({
      Electronics: ElectronicsSum,
      Fashion: FashionSum,
      Books: BooksSum,
      Grocery: GrocerySum
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/SalesByDate", async (req, res) => {
  try {
    console.log("Fakhar");
    console.log(req.body);
    const Date1Year = req.body.Date1.substring(0, 4);
    console.log(Date1Year);
    const Date1Month = req.body.Date1.substring(5, 7);
    console.log(Date1Month);
    const Date1Day = req.body.Date1.substring(8, 10);
    console.log(Date1Day);
    const Date2Year = req.body.Date2.substring(0, 4);
    console.log(Date2Year);
    const Date2Month = req.body.Date2.substring(5, 7);
    console.log(Date2Month);
    const Date2Day = req.body.Date2.substring(8, 10);
    console.log(Date2Day);
    const res1 = await Sales.find({
      createdAt: {
        $gte: new Date(`${Date1Year}`, `${Date1Month}`, `${Date1Day}`),
        $lt: new Date(`${Date2Year}`, `${Date2Month}`, `${Date2Day}`)
      }
    });
    const Electronics = res1.filter(product => {
      return product.category === "Electronics";
    });

    const ElectronicSales = Electronics.map(product => {
      return product.sale_price;
    });
    const ElectronicsSum = ElectronicSales.reduce((a, b) => {
      return a + b;
    }, 0);

    const Fashion = res1.filter(product => {
      return product.category === "Fashion";
    });

    const FashionSales = Fashion.map(product => {
      return product.sale_price;
    });
    const FashionSum = FashionSales.reduce((a, b) => {
      return a + b;
    }, 0);

    const Books = res1.filter(product => {
      return product.category === "Books";
    });

    const BooksSales = Books.map(product => {
      return product.sale_price;
    });
    const BooksSum = BooksSales.reduce((a, b) => {
      return a + b;
    }, 0);

    const Grocery = res1.filter(product => {
      return product.category === "Grocery";
    });

    const GrocerySales = Grocery.map(product => {
      return product.sale_price;
    });
    const GrocerySum = GrocerySales.reduce((a, b) => {
      return a + b;
    }, 0);

    console.log(FashionSum);
    console.log(ElectronicsSum);
    console.log(BooksSum);
    console.log(GrocerySum);
    // console.log(res1);
    res.send({
      Electronics: ElectronicsSum,
      Fashion: FashionSum,
      Books: BooksSum,
      Grocery: GrocerySum
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/sales/something", async (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
