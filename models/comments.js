const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT comments.* FROM comments RIGHT JOIN articles USING (article_id) WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((comments) => {
      return comments.rows;
    });
};
