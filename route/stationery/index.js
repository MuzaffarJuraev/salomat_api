const { Router } = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const dataArray = [];
  db.collection("stationery")
    .find()
    .forEach((result) => {
      dataArray.push(result);
    })
    .then(() => {
      res
        .status(200)
        .json({ message: "The documents have been found", data: dataArray });
    })
    .catch(() => {
      res.status(500).json({ message: "Something went wrong" });
    });
});

router.get("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("stationery")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
        if (result) {
          res
            .status(200)
            .json({ message: "The document has been found", data: result });
        } else {
          res
            .status(404)
            .json({ message: "Could not find a document using this id" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Something went wrong" });
      });
  } else {
    res.status(500).json({ message: "Not a valid id" });
  }
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("stationery")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "The document has been deleted" });
        } else {
          res
            .status(404)
            .json({ message: "Could not find a document using this id" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Something went wrong" });
      });
  } else {
    res.status(500).json({ message: "Not a valid id" });
  }
});

router.post("/", (req, res) => {
  const db = getDb();
  if (req.body) {
    db.collection("stationery")
      .insertOne(req.body)
      .then((result) => {
        if (result) {
          res.status(201).json({ message: "A new document has been added" });
        } else {
          res.status(500).json({ message: "Something went wrong" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Something went wrong" });
      });
  } else {
    res.status(400).json({ message: "Bad request has been detected" });
  }
});

router.patch("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("stationery")
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
    res.status(500).json({ message: "Not a valid id" });
  }
});

module.exports = router;
