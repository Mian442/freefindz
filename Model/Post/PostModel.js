var mongoose = require("mongoose");
var Joi = require("joi");
var postSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  website: String,
  ph: Number,
  short_description: String,
  date: Date,
  category: {
    text: {
      type: String,
      default: "",
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  description: String,
  email: String,
  address: {
    lat: Number,
    lng: Number,
    place: String,
  },
  pic: Array,
  cover: String,
  expiresAt: Date,
  comment: Array,
  video: String,
});

postSchema.statics.getPost = async function () {
  let post = await PostModel.find().select(
    "cover expiresAt short_description category _id"
  );
  return post;
};

postSchema.statics.getPostByUser = async function (id) {
  let post = await PostModel.find({
    user: id,
  }).select("cover expiresAt short_description category _id");
  return post;
};

postSchema.statics.getPostById = async function (id) {
  let post = await PostModel.findById(id);
  return post;
};

postSchema.statics.getPostByCategory = async function (category) {
  let post = await PostModel.find({
    "category.text": { $regex: `^${category}`, $options: "i" },
  }).select("cover expiresAt short_description category _id");
  return post;
};
postSchema.methods.addPost = async function (data) {
  // Add post
  let post = new PostModel({
    user: data.id,
    website: data.website,
    short_description: data.short_description,
    ph: data.ph,
    date: data.date,
    category: data.category,
    description: data.description,
    email: data.email,
    address: data.address,
    pic: data.pic,
    cover: data.cover,
    expiresAt: data.expiresAt,
    comment: [],
    video: null,
  });

  post = await post.save();
  return post;
};

postSchema.statics.updatePost = async function (id, data) {
  // Add post
  let post = await PostModel.findById(id);
  post.website = data.website;
  post.short_description = data.short_description;
  post.ph = data.ph;
  post.date = data.date;
  post.category = data.category;
  post.description = data.description;
  post.email = data.email;
  post.address = data.address;
  post.pic = data.pic;
  post.cover = data.cover;
  post.expiresAt = data.expiresAt;
  post = await post.save();
  return post;
};

postSchema.statics.video = async function (id, data) {
  // Add post
  let post = await PostModel.findById(id);
  post.video = data;
  post = await post.save();
  return post;
};

postSchema.methods.addPostComment = async function (id, data) {
  // Add post
  let post = await PostModel.findById(id);
  post.comment.push(data);
  post = await post.save();
  return post.comment;
};

postSchema.statics.deletePost = async function (id) {
  // Add post
  await PostModel.deleteOne(id);
  return "Done!";
};

postSchema.statics.validate = async function (data) {
  //  Validating
  return validatePost(data);
};

function validatePost(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    website: Joi.string().required(),
    short_description: Joi.string().required(),
    ph: Joi.number().required(),
    expiresAt: Joi.date().required(),
    category: Joi.object({
      text: Joi.string().required(),
      index: Joi.number().required(),
    }).required(),
    description: Joi.string().required(),
    email: Joi.string().email().required(),
    cover: Joi.string().required(),
    pic: Joi.array(),
    address: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
      place: Joi.string().required(),
    }),
    comment: Joi.array(),
    video: Joi.string().optional(),
  });
  return schema.validate(data, { abortEarly: false });
}

var PostModel = mongoose.model("Post", postSchema);
module.exports = PostModel;
