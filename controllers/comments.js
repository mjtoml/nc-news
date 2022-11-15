const { selectCommentsByArticleId, insertComment } = require("../models/comments");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      if (!comments.length) throw { status: 404, msg: "Article not found" };
      res
        .status(200)
        .send({ comments: comments.filter((comment) => comment.comment_id) });
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
})