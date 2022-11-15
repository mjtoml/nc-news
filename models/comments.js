const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT comments.* FROM comments JOIN articles USING (article_id) WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((comments) => {
      return comments.rows;
    });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [article_id, username, body]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};
