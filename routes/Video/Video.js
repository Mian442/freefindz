var express = require("express");
var router = express.Router();
const fs = require("fs");
/* GET home page. */
router.get("/:folder/name", function (req, res, next) {
  try {
    console.log("1");
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }
    console.log("2");
    // get video stats (about 61MB)
    const videoPath = `/video/${req.params.folder}/${req.params.name}`;
    const videoSize = fs.statSync(videoPath).size;
    console.log(size);

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 7 + 5; // 15MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = router;
