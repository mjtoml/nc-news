const {
  selectArticles,
  selectArticleById,
  updateArticleById,
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      if (!article) throw { status: 404, msg: "Article not found" };
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (!inc_votes) return next({ status: 400, msg: "Bad request" });
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      if (!article) throw { status: 404, msg: "Article not found" };
      res.status(200).send({ article });
    })
    .catch(next);
};
