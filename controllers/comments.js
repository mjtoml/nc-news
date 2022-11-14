const { selectCommentsByArticleId } = require("../models/comments");

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
