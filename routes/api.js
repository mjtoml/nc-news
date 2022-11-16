const apiRouter = require("express").Router();
const articlesRouter = require("./articles");
const topicsRouter = require("./topics");
const commentsRouter = require("./comments");
const usersRouter = require("./users");
const endpoints = require("../endpoints.json");

apiRouter.route("/").get((req, res, next) => {
  res.status(200).send({ endpoints });
});

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
