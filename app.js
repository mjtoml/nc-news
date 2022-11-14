const express = require("express");
const { getTopics } = require("./controllers/topics");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
} = require("./controllers/articles");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Invalid type" });
  else next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
