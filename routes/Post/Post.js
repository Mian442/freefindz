var express = require("express");
const Auth = require("../../Middleware/Auth/Auth");
const PostValidator = require("../../Middleware/Post/PostValidator");
const PostModel = require("../../Model/Post/PostModel");
var router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    let post = await PostModel.getPost();
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

/* GET users listing. */
router.get("/:id", async function (req, res, next) {
  try {
    let post = await PostModel.getPostById(req.params.id);
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

/* GET users listing. */
router.get("/category/:category", async function (req, res, next) {
  try {
    let post = await PostModel.getPostByCategory(req.params.category);
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
/* GET users listing. */
router.post("/", Auth, PostValidator, async function (req, res, next) {
  try {
    let post = new PostModel();
    post = await post.addPost(req.body);
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.put("/", Auth, async function (req, res, next) {
  try {
    let post = await PostModel.updatePost(req.body._id, req.body);
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    await PostModel.deletePost(req.body);
    res.status(200).send("Post Deleted!");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = router;
