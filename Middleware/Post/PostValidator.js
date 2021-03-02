let PostModel = require("../../Model/Post/PostModel");
module.exports = async function (req, res, next) {
  const { error } = await PostModel.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  req.isValidated = true;
  next();
};
