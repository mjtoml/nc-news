const {
  selectCommentsByArticleId,
  insertComment,
  deleteCommentById,
  updateComment,
} = require("../models/comments");
const { exists } = require("../models/utils");
const { nextPageURL } = require("./utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit = 10, p = 1 } = req.query;
  if (!(p > 0) || !(limit > 0))
    throw { status: 400, msg: "Invalid limit or p (page) query" };

  const articleExists = exists("articles", "article_id", article_id);
  const comments = selectCommentsByArticleId(article_id);

  Promise.all([articleExists, comments])
    .then(([articleExists, { comments, total_count }]) => {
      if (!articleExists) throw { status: 404, msg: "Article not found" };

      const current_page = Number(p);
      const pageStart = (current_page - 1) * Number(limit);
      const pageEnd = pageStart + Number(limit);

      if (pageStart > total_count) throw { status: 404, msg: "Page not found" };
      const next_page =
        pageEnd < total_count ? nextPageURL(req, current_page) : null;

      res.status(200).send({
        comments: comments.slice(pageStart, pageEnd),
        total_count,
        current_page,
        next_page,
      });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then((comment) => {
      if (!comment) throw { status: 404, msg: "Comment not found" };
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then((comment) => {
      if (!comment) throw { status: 404, msg: "Comment not found" };
      res.status(200).send({ comment });
    })
    .catch(next);
};
