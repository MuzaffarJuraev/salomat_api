const { Router } = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const drinks = [];
  db.collection("drinks")
    .find()
    .forEach((drink) => {
      drinks.push(drink);
    })
    .then(() => {
      res
        .status(200)
        .json({ message: "The documents has been found", data: drinks });
    })
    .catch(() => {
      res.status(404).json({ message: "Could not find the documents" });
    });
});

router.get("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("drinks")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        if (result) {
          res
            .status(200)
            .json({ message: "The document has been found", data: result });
        } else {
          res
            .status(404)
            .json({ message: "Could not find a document with this id" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "Something went wrong" });
      });
  } else {
    res.status(500).json({ message: "Not a valid id" });
  }
});

router.post("/", (req, res) => {
  const db = getDb();
  if (req.body) {
    db.collection("drinks")
      .insertOne(req.body)
      .then((result) => {
        if (result) {
          res.status(201).json({ message: "A new document has been added" });
        } else {
          res.status(500).json({ message: "Something went wrong" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "Something went wrong" });
      });
  } else {
    res.status(400).json({ message: "Bad request has been detected" });
  }
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("drinks")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "The document has been deleted" });
        } else {
          res
            .status(404)
            .json({ message: "Could not delete a document with this id" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Something went wrong" });
      });
  } else {
    res.status(500).json({ message: "Not a valid id" });
  }
});

router.patch("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    if (req.body) {
      db.collection("drinks")
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
          res.status(500).json({ message: "Somethin went wrong" });
        });
    } else {
      res.status(500).json({ message: "There should data in body" });
    }
  } else {
    res.status(500).json({ message: "Not a valid id has been detected" });
  }
});

module.exports = router;
