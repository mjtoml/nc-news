const {
  selectArticles,
  selectArticleById,
  updateArticleById,
  insertArticle,
  deleteArticleById,
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  const limit = +req.query.limit || 10;
  const current_page = +req.query.p || 1;
  selectArticles(topic, sort_by, order)
    .then(([articles, total_count]) => {
      const pageStart = (current_page - 1) * limit;
      const pageEnd = pageStart + limit;
      if (pageStart > total_count) throw { status: 404, msg: "Page not found" };

      let next_page = null;
      if (pageEnd < total_count) {
        const nextURL = new URL(
          req.protocol + "://" + req.get("host") + req.originalUrl
        );
        nextURL.searchParams.set("p", current_page + 1);
        next_page = nextURL.href;
      }

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
