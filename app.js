const express = require("express");
const apiRouter = require("./routes/api");
const {
  unknownRoute,
  customError,
  dbTypeError,
  nullError,
  dbForeignKeyError,
  serverError,
} = require("./errors");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(unknownRoute);
app.use(customError);
app.use(dbTypeError);
app.use(nullError);
app.use(dbForeignKeyError);
app.use(serverError);

module.exports = app;
