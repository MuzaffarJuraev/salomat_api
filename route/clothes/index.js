const { Router } = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");
const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const clothes = [];
  db.collection("clothes")
    .find()
    .forEach((clothe) => {
      clothes.push(clothe);
    })
    .then(() => {
      res
        .status(200)
        .json({ data: clothes, message: "Data has been sent successfully" });
    })
    .catch(() => {
      res.status(500).json({ message: "Could not find the documents" });
    });
});

router.get("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("clothes")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: "The document has been found successfully",
            data: result,
          });
        } else {
          res.status(500).json({ message: "Could not find the document" });
        }
      });
  } else {
    res.status(500).json({ message: "Not a valid id" });
  }
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  if (ObjectId.isValid(req.params.id)) {
    db.collection("clothes")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res
            .status(200)
            .json({ message: "The document has been deleted successfully" });
          db = null;
        } else {
          res
            .status(500)
            .json({ message: "Not an existing document has been detected" });
          db = null;
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Could not delete the document" });
        db = null;
      });
  } else {
    res.status(500).json({ message: "Not a valid id" });
    db = null;
  }
});

router.post("/", (req, res) => {
  const db = getDb();
  if (req.body) {
    db.collection("clothes")
      .insertOne(req.body)
      .then((result) => {
        if (result) {
          res
            .status(201)
            .json({ message: "The document has been added successfully" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Something went wrong" });
      });
  }
});

router.patch("/:id", (req, res) => {
  const db = getDb();
  const clothe = req.body;
  const id = req.params.ids;
  if (ObjectId.isValid(id)) {
    if (clothe) {
      db.collection("clothes")
        .updateOne({ _id: new ObjectId(id) }, { $set: clothe })
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

module.exports = router;
