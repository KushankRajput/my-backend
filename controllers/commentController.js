const Comment = require("../models/comments");
const Post = require("../models/posts");

// Create Comment
exports.createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const user = req.user.id;
    // Insert using SAVE function
    // for using this we need to create an object first

    // const comment = new Comment({ postId, user, text });
    // const savedComment = await comment.save();
    const savedComment = await Comment.create({ postId, user, text });

    // Find the post by id and add the new commentId to post schema's comments array
    // yaha pr hum post ki id find krke uske andr update kr rhe hai ($push ki help se) or post schema me jo  comments array hai uske andr comment schema ki id save kr rhe hain
    // new true ka mtlb update krne ke bad vo updated object mujhe return krdo
    // populates ki help se hum acutal comment get kr skte hain na ki sirf id
    // And increase commentCount by 1
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: savedComment._id }, $inc: { commentsCount: 1 } },
      { new: true },
    ).populate("comments");
    // await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(200).json({
      success: true,
      post: updatedPost,
      message: "Comment added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error.message,
      message: "Internal server error",
    });
  }
};

// Delete comment
exports.removeComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { postId, commentId } = req.body;
    const userId = req.user.id;

    if (!postId || !commentId) {
      return res.status(400).json({
        success: false,
        message: "postId and commentId are required",
      });
    }

    //Proper ownership check
    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      postId: postId,
      user: userId,
    });

    if (!deletedComment) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    // Update post safely
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: commentId },
        $inc: { commentsCount: -1 },
      },
      { new: true },
    ).populate("comments");

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getComment = async (req, res) => {
  try {
    const postId = req.body.postId;
    const user = req.user.id;

    const comments = await Comment.find({ postId, user }).sort({
      createdAt: -1,
    });

    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No comments found",
      });
    }

    res.status(200).json({
      success: true,
      data: comments,
      message: "Comments fetched",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error.message,
      message: "Internal server error",
    });
  }
};

// async function initializeCollections() {
//   await Post.create({ title: "test", content: "test" });
//   await Like.create({ postId: null });
//   await Comment.create({ postId: null }); // adjust करें
// }
