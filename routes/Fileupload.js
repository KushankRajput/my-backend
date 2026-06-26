const express = require("express");
const router = express.Router();

const {
  localFileUpload,
  imageUpload,
  getImages,
  videoFileUpload,
  imageReduceUpload,
  renderView,
  deleteAllImages,
} = require("../controllers/fileUpload");

router.post("/localFileUpload", localFileUpload);
router.post("/fileUpload", imageUpload);
router.post("/videoFileUpload", videoFileUpload);
router.post("/imageReduceUpload", imageReduceUpload);
router.get("/files", getImages);
router.delete("/delete-all", deleteAllImages);

router.get("/form", (req, res) => {
  res.render("form", { message: null });
});

router.get("/home", renderView);
module.exports = router;
