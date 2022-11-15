const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comment_id)::int as comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY article_id ORDER BY created_at DESC;"
    )
    .then((articles) => {
      return articles.rows;
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1 LIMIT 1", [article_id])
    .then((article) => {
      return article.rows[0];
    });
};
