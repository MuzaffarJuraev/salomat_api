const express = require("express");
const { connectDb } = require("./db");
const {
  foodRoute,
  clothesRoute,
  cookiesRoute,
  drinksRoute,
  stationeryRoute,
  homeRoute,
} = require("./route");

const app = express();

connectDb((err) => {
  if (err) throw err;
  app.listen(4000, () => {
    console.log("the server is running on port 4000");
  });
});

app.use(express.json());

app.use("/", homeRoute);
app.use("/food", foodRoute);
app.use("/clothes", clothesRoute);
app.use("/cookies", cookiesRoute);
app.use("/drinks", drinksRoute);
app.use("/stationery", stationeryRoute);
