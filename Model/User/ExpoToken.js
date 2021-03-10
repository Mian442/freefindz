var mongoose = require("mongoose");
var Joi = require("joi");
var ExpoTokenSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: String,
});

ExpoTokenSchema.statics.getExpoTokenById = async function (id) {
  let ExpoToken = await ExpoTokenModel.findOne({
    user: id,
  }).populate("user", "_id name type pic ph username email");
  return ExpoToken;
};

ExpoTokenSchema.methods.getExpoTokens = async function () {
  let ExpoToken = await ExpoTokenModel.find();
  return ExpoToken;
};

ExpoTokenSchema.methods.addExpoToken = async function (id, token) {
  // Add ExpoToken
  let ExpoToken = new ExpoTokenModel({
    user: id,
    token,
  });

  ExpoToken = await ExpoToken.save();
  return ExpoToken;
};

ExpoTokenSchema.statics.validate = async function (data) {
  //  Validating
  return validateExpoToken(data);
};

function validateExpoToken(data) {
  const schema = Joi.object({
    city: Joi.string().required(),
    website: Joi.string().required(),
    short_description: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
}

var ExpoTokenModel = mongoose.model("ExpoToken", ExpoTokenSchema);
module.exports = ExpoTokenModel;
