const Post = require("../models/posts.js");
const Comment = require("../models/comments.js");
const Like = require("../models/likes.js");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.create({ title, content, userId });

    res.status(200).json({
      success: true,
      data: post,
      message: "Post created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error.message,
      message: "Internal server error",
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      userId: userId,
    });

    if (!deletedPost) {
      return res.status(403).json({
        success: false,
        message: "Ye post tumhari nahi hai, delete nahi kar sakte",
      });
    }

    await Comment.deleteMany({ postId });
    await Like.deleteMany({ postId });

    res.status(200).json({
      success: true,
      message: "Post successfully deleted",
      data: deletedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user.id);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const posts = await Post.find({ userId: req.user.id });

    res.status(200).json({
      success: true,
      data: posts,
      message: "All posts are here",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
