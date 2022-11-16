const { selectUsers, selectUserByUsername } = require("../models/users");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      if (!user) return next({ status: 404, msg: "User not found" });
      res.status(200).send({ user });
    })
    .catch(next);
};
