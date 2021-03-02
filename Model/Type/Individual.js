var mongoose = require("mongoose");
var Joi = require("joi");
var individualSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gender: {
    text: {
      type: String,
      default: "Male",
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  age: {
    text: {
      type: String,
      default: "18-25",
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  city: String,
  findUs: String,
});

individualSchema.statics.getIndividualById = async function (id) {
  let individual = await IndividualModel.findOne({
    user: id,
  }).populate("user", "_id name type pic ph username email");
  return individual;
};

individualSchema.methods.addIndividual = async function (id, data) {
  // Add individual
  let individual = new IndividualModel({
    user: id,
    gender: data.gender,
    age: data.age,
    city: data.city,
    findUs: data.findUs,
  });

  individual = await individual.save();
  return individual;
};

individualSchema.statics.updateIndividual = async function (id, data) {
  // Add individual
  let individual = await IndividualModel.findById(data.id);
  if (!individual) {
    individual = new IndividualModel({
      user: id,
      gender: data.gender,
      age: data.age,
      city: data.city,
    });
  } else {
    individual.gender = data.gender;
    individual.age = data.age;
    individual.city = data.city;
  }

  individual = await individual.save();
  return individual;
};

individualSchema.statics.validate = async function (data) {
  //  Validating
  return validateIndividual(data);
};

function validateIndividual(data) {
  const schema = Joi.object({
    age: Joi.string().required(),
    city: Joi.string().required(),
    gender: Joi.string().required(),
    findUs: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
}

var IndividualModel = mongoose.model("Individual", individualSchema);
module.exports = IndividualModel;
