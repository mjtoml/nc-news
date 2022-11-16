const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/comments");

commentsRouter.route("/:comment_id").delete(deleteComment);

module.exports = commentsRouter;
