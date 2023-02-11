const { Router } = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");
const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const cookies = [];
  db.collection("cookies")
    .find()
    .forEach((cookie) => {
      cookies.push(cookie);
    })
    .then(() => {
      res
        .status(200)
        .json({ message: "The documents have been found.", data: cookies });
    })
    .catch(() => {
      res.status(500).json({ message: "Something went wrong" });
    });
});

router.get("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("cookies")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        if (result) {
          res
            .status(200)
            .json({ message: "The document has been found.", data: result });
        } else {
          res.status(404).json({ message: "The document has not been found" });
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
    db.collection("cookies")
      .insertOne(req.body)
      .then(() => {
        res.status(201).json({ message: "A new document has been added" });
      })
      .catch(() => {
        res.status(500).json({ message: "Something went wrong" });
      });
  } else {
    res.status(500).json({
      message: "You could not add new document with empty body",
    });
  }
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("cookies")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "The document has been deleted" });
        } else {
          res
            .status(404)
            .json({ message: "Nothing has been found with this id" });
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
      db.collection("cookies")
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
          res.status(500).json({ message: "Something went worng" });
        });
    } else {
      res
        .status(400)
        .json({ message: "You have to insert updating data in body" });
    }
  } else {
    res.status(500).json({ message: "Not a valid id" });
  }
});

module.exports = router;
