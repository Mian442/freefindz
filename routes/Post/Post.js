var express = require("express");
const Auth = require("../../Middleware/Auth/Auth");
const PostCURDValidator = require("../../Middleware/Post/PostCURDValidator");
const PostValidator = require("../../Middleware/Post/PostValidator");
const PostModel = require("../../Model/Post/PostModel");
var router = express.Router();
const { Expo } = require("expo-server-sdk");
const fileUpload = require("express-fileupload");
const ExpoTokenModel = require("../../Model/User/ExpoToken");
var multer = require("multer");
const fs = require("fs-extra");
let app = express();
app.use(fileUpload());
var storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    //req.body is empty...
    //How could I get the new_file_name property sent from client here?
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });
/* GET users listing. */
router.get("/", async function (req, res) {
  try {
    let post = await PostModel.getPost();
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

/* GET users listing. */
router.get("/:id", async function (req, res) {
  try {
    let post = await PostModel.getPostById(req.params.id);
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

/* GET users listing. */
router.get("/category/:category", async function (req, res) {
  try {
    let post = await PostModel.getPostByCategory(req.params.category);
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
/* GET users listing. */
router.post("/addComment", Auth, async function (req, res) {
  try {
    let post = await PostModel().addPostComment(
      req.body.postId,
      req.body.comment
    );
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
/* GET users listing. */
router.post(
  "/",
  Auth,
  PostCURDValidator,
  PostValidator,
  async function (req, res) {
    try {
      let post = new PostModel();
      post = await post.addPost(req.body);
      let tokens = await ExpoTokenModel().getExpoTokens();
      let expo = new Expo();
      let messages = [];
      console.log(tokens);
      // tokens = tokens.filter((i) => i.user !== post.user);
      if (tokens) {
        for (let pushToken of tokens) {
          // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

          // Check that all your push tokens appear to be valid Expo push tokens
          if (!Expo.isExpoPushToken(pushToken.token)) {
            console.error(
              `Push token ${pushToken} is not a valid Expo push token`
            );
            continue;
          }

          // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
          messages.push({
            to: pushToken.token,
            sound: "default",
            title: post.category.text,
            body: post.short_description,
            subtitle: post.description,
            data: { withSome: "data" },
            channelId: "new-post",
          });
        }
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
          for (let chunk of chunks) {
            try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              tickets.push(...ticketChunk);
            } catch (error) {
              console.error(error);
            }
          }
        })();
      }
      res.status(200).send(post);
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  }
);
router.post("/addVideo", upload.single("document"), async function (req, res) {
  try {
    console.log(req.file, req.query, process.env.NODE_ENV);
    const currentPath = req.file.path;
    const destinationPath = `video/${req.query.id}/${req.file.originalname}`;
    console.log(currentPath, destinationPath);

    await fs.move(currentPath, `public/${destinationPath}`, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Successfully moved the file!");
      }
    });
    await PostModel.video(
      req.query.id,
      `${process.env.URL}/${destinationPath}`
    );
    post = await PostModel.getPost();
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
router.put("/", Auth, PostCURDValidator, async function (req, res) {
  try {
    let post = await PostModel.updatePost(req.body._id, req.body);
    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async function (req, res) {
  try {
    await PostModel.deletePost(req.body);
    res.status(200).send("Post Deleted!");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = router;
