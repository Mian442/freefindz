let UserModel = require("../../Model/User/UserModel");
module.exports = async function (req, res, next) {
  let user = await UserModel.findOne({ username: req.body.username });
  if (user) {
    return res.status(400).send("Username has been already registered");
  }
  req.isValidated = true;
  next();
};
