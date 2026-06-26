const Post = require("../models/posts");
const Like = require("../models/likes");
const Comment = require("../models/comments");

// Like
exports.createLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const user = req.user.id;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "PostId is required",
      });
    }

    const alreadyLiked = await Like.findOne({ postId, user });
    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
      });
    }
    const like = await Like.create({
      postId: postId,
      user: user,
    });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: like._id }, $inc: { likesCount: 1 } },
      { new: true },
    ).populate("likes");

    if (!updatedPost) {
      return res.status(200).json({
        success: true,
        message: "Post not updated",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: "Post liked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error.message,
      message: "Internal server error",
    });
  }
};

//Unlike
exports.deleteLike = async (req, res) => {
  try {
    //  Auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { postId, likeId } = req.body;
    const user = req.user.id;

    //  Only owner of like can delete it
    const dislike = await Like.findOneAndDelete({
      _id: likeId,
      postId: postId,
      user: user,
    });

    if (!dislike) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this post",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: likeId },
        $inc: { likesCount: -1 },
      },
      { new: true },
    ).populate("likes");

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: "Post unliked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
