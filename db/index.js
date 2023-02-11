const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connectDb: (cb) => {
    MongoClient.connect("mongodb://localhost:27017/salomat")
      .then((client) => {
        dbConnection = client.db();
        console.log("db connected");
        return cb();
      })
      .catch((err) => {
        console.log("db connection error => ", err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
