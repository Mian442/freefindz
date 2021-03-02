let UserModel = require("../../Model/User/UserModel");
module.exports = async function (req, res, next) {
  let user = await UserModel.findById(req.body.id);
  if (!user) {
    return res.status(400).send("Yor Are not Authorized!");
  }
  req.isValidated = true;
  next();
};
