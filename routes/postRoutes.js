const express = require("express");
const {
  createPost,
  getPosts,
  deletePost,
} = require("../controllers/postController");
const { createLike, deleteLike } = require("../controllers/likeController");
const {
  createComment,
  removeComment,
  getComment,
} = require("../controllers/commentController");
const {
  signup,
  login,
  getUsers,
  getUserDetails,
} = require("../controllers/Auth");
const { auth, isAdmin } = require("../middlewares/auth");
const {
  addCart,
  deleteCart,
  getCart,
  deleteProductFromCart,
} = require("../controllers/cartController");
const { addProduct } = require("../controllers/productController");
const { placeOrder } = require("../controllers/placeOrderController");
const { createAddress } = require("../controllers/addressController");

const router = express.Router();

/* ------------------------  POST ROUTES  ------------------------ */

/**
 * @swagger
 * /api/v1/createPost:
 *   post:
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post("/createPost", auth, createPost);

/**
 * @swagger
 * /api/v1/getPosts:
 *   get:
 *     summary: Get all posts
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/getPosts", auth, getPosts);

/**
 * @swagger
 * /api/v1/deletePosts/{id}:
 *   delete:
 *     summary: Delete post by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Post deleted
 */
router.delete("/deletePosts", auth, deletePost);

/* ------------------------  LIKE ROUTES  ------------------------ */

/**
 * @swagger
 * /api/v1/like:
 *   post:
 *     summary: Like a post
 *     responses:
 *       200:
 *         description: Post liked successfully
 */
router.post("/like", auth, createLike);

/**
 * @swagger
 * /api/v1/unlike:
 *   delete:
 *     summary: Remove like from a post
 *     responses:
 *       200:
 *         description: Like removed
 */
router.post("/unlike", auth, deleteLike);

/* ------------------------  COMMENT ROUTES  ------------------------ */

/**
 * @swagger
 * /api/v1/createComment:
 *   post:
 *     summary: Create a comment
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post("/createComment", auth, createComment);

/**
 * @swagger
 * /api/v1/removeComment:
 *   delete:
 *     summary: Delete a comment
 *     responses:
 *       200:
 *         description: Comment removed
 */
router.post("/removeComment", auth, removeComment);

/**
 * @swagger
 * /api/v1/getComment:
 *   get:
 *     summary: Get all comments
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get("/getComment", auth, getComment);

/* ------------------------  USER ROUTES  ------------------------ */

/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     summary: User signup
 *     responses:
 *       201:
 *         description: User registered
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: User login
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", getUsers);

/**
 * @swagger
 * /api/v1/userdetails:
 *   get:
 *     summary: Get logged-in user's details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Auth user details
 */
router.get("/userdetails", auth, getUserDetails);

/* ------------------------  CART ROUTES  ------------------------ */

/**
 * @swagger
 * /api/v1/addCart:
 *   post:
 *     summary: Add item to cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Item added to cart
 */
router.post("/addCart", auth, addCart);
/* ------------------------  Product ROUTES  ------------------------ */

/**
 * @swagger
 * /api/v1/addCart:
 *   post:
 *     summary: Add product
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product added
 */
router.post("/addProduct", auth, addProduct);

/**
 * @swagger
 * /api/v1/addCart:
 *   post:
 *     summary: Cart fetched
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Get Cart
 */
router.get("/get/cart", auth, getCart);

/**
 * @swagger
 * /api/v1/addCart:
 *   post:
 *     summary: Cart deleted
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Delete Cart
 */
router.delete("/cart/delete", auth, deleteCart);

/**
 * @swagger
 * /api/v1/addCart:
 *   post:
 *     summary: Cart deleted
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Delete Cart
 */
router.delete("/cartproduct/delete", auth, deleteProductFromCart);

/**
 * @swagger
 * /api/v1/addCart:
 *   post:
 *     summary: Cart deleted
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Delete Cart
 */
router.post("/placeorder", auth, placeOrder);

router.post("/add-address", auth, createAddress);

module.exports = router;
