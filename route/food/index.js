const { ObjectId } = require("mongodb");
const { Router } = require("express");
const { getDb } = require("../../db");

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  let foodArray = [];

  db.collection("food")
    .find()
    .forEach((food) => {
      foodArray.push(food);
    })
    .then(() => {
      res.status(200).json(foodArray);
    })
    .catch(() => {
      res.status(500).json({ message: "Could not find foods" });
    });
});

router.get("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("food")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((product) => {
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(500).json({ message: "Could not find the product" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Could not find the product" });
      });
  } else {
    res.status(500).json({ message: "Not a valid id" });
  }
});

router.post("/", (req, res) => {
  const db = getDb();
  if (req.body) {
    db.collection("food")
      .insertOne(req.body)
      .then((result) => {
        res
          .status(201)
          .json({ data: result, message: "Product added successfully" });
      })
      .catch(() => {
        res.status(500).json({ message: "Could not add a new product" });
      });
  } else {
    res.status(400).json({ message: "Bad request has been detected" });
  }
});

router.patch("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    if (req.body) {
      db.collection("food")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
        .then((result) => {
          if (result.modifiedCount > 0) {
            res.status(200).json({ message: "The document has been updated" });
          } else {
            res
              .status(404)
              .json({ message: "Could not update a document using this id" });
          }
        })
        .catch(() => {
          res.status(500).json({ message: "Something went wrong" });
        });
    } else {
      res.status(500).json({ message: "Bad request has been detected" });
    }
  } else {
    res.status(500).json({ message: "Not a valid id has been detected" });
  }
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("food")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then(() => {
        res
          .status(200)
          .json({ message: "Product has been deleted successfuly" });
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: "Could not delete the product with this id" });
      });
  } else {
    res.status(500).json({ message: "Not a valid id has been detected" });
  }
});

module.exports = router;
