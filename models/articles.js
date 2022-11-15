const db = require("../db/connection");
const format = require("pg-format");
const { exists } = require("./utils");

exports.selectArticles = async (
  topic,
  sort_by = "created_at",
  order = "DESC"
) => {
  order = order.toUpperCase();
  const sortable = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!sortable.includes(sort_by))
    throw { status: 400, msg: "Invalid sort_by query" };
  if (order !== "ASC" && order !== "DESC")
    throw { status: 400, msg: "Invalid order query" };
  if (topic && !(await exists("topics", "slug", topic)))
    throw { status: 404, msg: "Topic not found" };

  const where = topic ? format("WHERE topic = %L", topic) : "";
  const sql = format(
    "SELECT articles.*, COUNT(comment_id)::int as comment_count FROM articles LEFT JOIN comments USING (article_id) %s GROUP BY article_id ORDER BY %I %s;",
    where,
    sort_by,
    order
  );

  return db.query(sql).then((articles) => {
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

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((article) => {
      return article.rows[0];
    });
};
