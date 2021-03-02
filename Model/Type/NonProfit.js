var mongoose = require("mongoose");
var Joi = require("joi");
var nonProfitSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  website: String,
  city: String,
  short_description: String,
});

nonProfitSchema.statics.getNonProfitById = async function (id) {
  let nonProfit = await NonProfitModel.findOne({
    user: id,
  }).populate("user", "_id name type pic ph username email");
  return nonProfit;
};

nonProfitSchema.methods.addNonProfit = async function (id, data) {
  // Add nonProfit
  let nonProfit = new NonProfitModel({
    user: id,
    website: data.website,
    city: data.city,
    short_description: data.short_description,
  });

  nonProfit = await nonProfit.save();
  return nonProfit;
};

nonProfitSchema.statics.updateNonProfit = async function (id, data) {
  // Add nonProfit
  let nonProfit = await NonProfitModel.findById(id);
  if (!nonProfit) {
    nonProfit = new NonProfitModel({
      user: id,
      website: data.website,
      city: data.city,
      short_description: data.short_description,
    });
  } else {
    nonProfit.website = data.website;
    nonProfit.short_description = data.short_description;
    nonProfit.city = data.city;
  }

  nonProfit = await nonProfit.save();
  return nonProfit;
};

nonProfitSchema.statics.validate = async function (data) {
  //  Validating
  return validateNonProfit(data);
};

function validateNonProfit(data) {
  const schema = Joi.object({
    city: Joi.string().required(),
    website: Joi.string().required(),
    short_description: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
}

var NonProfitModel = mongoose.model("NonProfit", nonProfitSchema);
module.exports = NonProfitModel;
