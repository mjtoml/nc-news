const db = require("../db/connection");
const format = require("pg-format");

exports.exists = (table, column, value) => {
  const sql = format("SELECT * FROM %I WHERE %I = %L;", table, column, value);
  return db.query(sql).then((result) => {
    return result.rows.length > 0;
  });
};
