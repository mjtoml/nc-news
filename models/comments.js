const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT comments.* FROM comments JOIN articles USING (article_id) WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((comments) => {
      return { comments: comments.rows, total_count: comments.rowCount };
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

exports.deleteCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.updateComment = (comment_id, inc_votes) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [inc_votes, comment_id]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};
