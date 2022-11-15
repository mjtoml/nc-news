const {
  selectCommentsByArticleId,
  insertComment,
  deleteCommentById,
} = require("../models/comments");
const { exists } = require("../models/utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const articleExists = exists("articles", "article_id", article_id);
  const comments = selectCommentsByArticleId(article_id);
  Promise.all([articleExists, comments])
    .then(([articleExists, comments]) => {
      if (!articleExists) throw { status: 404, msg: "Article not found" };
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (!username || !body)
    return next({ status: 400, msg: "Incomplete comment" });
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
