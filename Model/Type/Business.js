var mongoose = require("mongoose");
var Joi = require("joi");
var businessSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  website: String,
  city: String,
  short_description: String,
});

businessSchema.statics.getBusinessById = async function (id) {
  let business = await BusinessModel.findOne({
    user: id,
  }).populate("user", "_id name type pic ph username email");
  return business;
};

businessSchema.methods.addBusiness = async function (id, data) {
  // Add business
  let business = new BusinessModel({
    user: id,
    website: data.website,
    city: data.city,
    short_description: data.short_description,
  });

  business = await business.save();
  return business;
};

businessSchema.statics.updateBusiness = async function (id, data) {
  // Add business
  let business = await BusinessModel.findById(data.id);
  if (!business) {
    business = new BusinessModel({
      user: id,
      website: data.website,
      city: data.city,
      short_description: data.short_description,
    });
  } else {
    business.website = data.website;
    business.short_description = data.short_description;
    business.city = data.city;
  }

  business = await business.save();
  return business;
};

businessSchema.statics.validate = async function (data) {
  //  Validating
  return validateBusiness(data);
};

function validateBusiness(data) {
  const schema = Joi.object({
    city: Joi.string().required(),
    website: Joi.string().required(),
    short_description: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
}

var BusinessModel = mongoose.model("Business", businessSchema);
module.exports = BusinessModel;
