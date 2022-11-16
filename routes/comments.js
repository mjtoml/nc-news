const commentsRouter = require("express").Router();
const { deleteComment, patchComment } = require("../controllers/comments");

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentsRouter;
