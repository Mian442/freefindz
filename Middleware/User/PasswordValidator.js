let UserModel = require("../../Model/User/UserModel");
var bcrypt = require("bcryptjs");
module.exports = async function (req, res, next) {
  let user = await UserModel.findById(req.body.id);
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Invalid Password");
  req.isValidated = true;
  next();
};
