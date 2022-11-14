const express = require("express");
const app = express();
const { getArticles } = require("./controllers/articles");

app.get("/api/articles", getArticles);

module.exports = app;
