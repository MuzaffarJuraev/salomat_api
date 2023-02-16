const { Router } = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

const router = Router();

router.get("", (req, res) => {
  const db = getDb();
  let books = [];
  let clothes = [];
  let cookies = [];
  let drinks = [];
  let stationery = [];
  let food = [];
  db.collection("books")
    .find()
    .forEach((book) => {
      books.push(book);
    });
  db.collection("food")
    .find()
    .forEach((result) => {
      food.push(result);
    });
  db.collection("clothes")
    .find()
    .forEach((clothe) => {
      clothes.push(clothe);
    });

  db.collection("cookies")
    .find()
    .forEach((cookie) => {
      cookies.push(cookie);
    });

  db.collection("drinks")
    .find()
    .forEach((drink) => {
      drinks.push(drink);
    });

  db.collection("stationery")
    .find()
    .forEach((result) => {
      stationery.push(result);
    })
    .then(() => {
      res.status(200).json({
        message: "All data",
        data: {
          drinks: drinks.length,
          books: books.length,
          clothes: clothes.length,
          cookies: cookies.length,
          food: food.length,
          stationery: stationery.length,
        },
      });
    });
});

module.exports = router;
