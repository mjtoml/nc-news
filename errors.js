exports.unknownRoute =
  ("*",
  (req, res, next) => {
    next({ status: 404, msg: "Endpoint does not exist" });
  });

exports.customError = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.dbTypeError = (err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Invalid type" });
  else next(err);
};

exports.dbForeignKeyError = (err, req, res, next) => {
  if (err.code === "23503") res.status(404).send({ msg: "Not found" });
  else next(err);
};

exports.serverError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
