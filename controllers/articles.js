const {
  selectArticles,
  selectArticleById,
  updateArticleById,
  insertArticle,
  deleteArticleById,
} = require("../models/articles");
const { nextPageURL } = require("./utils");

exports.getArticles = (req, res, next) => {
  const {
    topic,
    sort_by = "created_at",
    order = "DESC",
    limit = 10,
    p = 1,
  } = req.query;

  if (!(p > 0) || !(limit > 0))
    throw { status: 400, msg: "Invalid limit or p (page) query" };

  selectArticles(topic, sort_by, order.toUpperCase())
    .then(({ articles, total_count }) => {
      const current_page = Number(p);
      const pageStart = (current_page - 1) * Number(limit);
      const pageEnd = pageStart + Number(limit);

      if (pageStart > total_count) throw { status: 404, msg: "Page not found" };
      const next_page =
        pageEnd < total_count ? nextPageURL(req, current_page) : null;

      res.status(200).send({
        articles: articles.slice(pageStart, pageEnd),
        total_count,
        current_page,
        next_page,
      });
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
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      if (!article) throw { status: 404, msg: "Article not found" };
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { title, body, topic, author } = req.body;
  insertArticle(title, body, topic, author)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticleById(article_id)
    .then((article) => {
      if (!article) throw { status: 404, msg: "Article not found" };
      res.sendStatus(204);
    })
    .catch(next);
};
