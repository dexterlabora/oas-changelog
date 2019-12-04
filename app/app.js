require("express-async-errors");

const express = require("express");
const router = require("./router");
const { join } = require("path");

const app = express();

/**
 * For parsing application/json
 */
app.use(express.json({ limit: "50mb" }));

/**
 * Routers
 */
app.get("/", function(req, res) {
  res.sendFile(join(__dirname + "/index.html"));
});
app.use("/public", express.static("public"));

app.use("/swagger", router);

/**
 * Error Handling
 */
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send(err);
});

module.exports = app;
