var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Joi = require("joi");
const ExpoTokenModel = require("./ExpoToken");
var userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  pic: { type: String, default: null },
  type: {
    text: {
      type: String,
      default: "Individual",
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  ph: Number,
});

userSchema.methods.generateHashedPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

userSchema.statics.getUserByUsername = async function (data) {
  const user = await UserModel.findOne({
    username: data.username,
  });
  let expo = await ExpoTokenModel.findOne({
    user: user._id,
    expo_token: data.expo_token,
  });
  if (!expo) {
    expo = new ExpoTokenModel();
    expo = await expo.addExpoToken(user._id, data.expo_token);
    await expo.save();
  }

  return {
    _id: user._id,
    name: user.name,
    type: user.type,
    pic: user.pic,
  };
};

userSchema.statics.addUser = async function (data) {
  // Add user
  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(data.password, salt);
  let user = new UserModel({
    name: data.name,
    username: data.username,
    pic: null,
    email: data.email,
    password,
    type: data.type,
    ph: data.ph,
  });

  user = await user.save();
  if (!expo) {
    expo = new ExpoTokenModel();
    expo = await expo.addExpoToken(user._id, data.expo_token);
    await expo.save();
  }
  return {
    _id: user._id,
    name: user.name,
    type: user.type,
    pic: user.pic,
  };
};

userSchema.statics.updateUser = async function (id, data) {
  // Add user
  let user = await UserModel.findById(id);
  user.name = data.name;
  user.username = data.username;
  user.pic = data.pic;
  user.email = data.email;
  user.type = data.type;
  user.ph = data.ph;

  user = await user.save();
  return {
    _id: user._id,
    name: user.name,
    type: user.type,
    pic: user.pic,
  };
};

userSchema.statics.updatePass = async function (data) {
  // Add user
  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(data.new, salt);
  let user = await UserModel.findById(data.id);
  user.password = password;

  user = await user.save();
  return "Password Updated";
};
userSchema.statics.validate = async function (data) {
  //  Validating
  return validateUser(data);
};

function validateUser(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email(),
    password: Joi.string().min(6).required(),
    pic: Joi.optional(),
    type: Joi.optional(),
    ph: Joi.number(),
  });
  return schema.validate(data, { abortEarly: false });
}

userSchema.statics.validateLogin = async function (data) {
  //  Validating
  return validateUserLogin(data);
};

function validateUserLogin(data) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(8).required(),
    expo_token: Joi.string(),
  });
  return schema.validate(data, { abortEarly: false });
}
var UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
