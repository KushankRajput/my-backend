const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns list of all users
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Kushank" }]);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post("/users", (req, res) => {
  res.json({ message: "User created" });
});

module.exports = router;
