const express = require("express");
const { getTopics } = require("./controllers/topics");
const { getArticles, getArticleById } = require("./controllers/articles");
const { getCommentsByArticleId, postComment } = require("./controllers/comments");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

app.use("*", (req, res, next) => {
  next({ status: 404, msg: "Endpoint does not exist" });
});

app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Invalid type" });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") res.status(404).send({ msg: "Not found" });
  else next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
