const express = require("express");
const { getTopics } = require("./controllers/topics");
const { getArticles } = require("./controllers/articles");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

module.exports = app;