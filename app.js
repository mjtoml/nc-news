const express = require("express");
const { getTopics } = require("./controllers/topics");
const { getArticles, getArticleById } = require("./controllers/articles");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

module.exports = app;
