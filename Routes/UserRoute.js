const express = require("express");
const {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  getAllUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
} = require("../Controller/UserController");
const { authMiddleware } = require("../Middleware/AuthMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/update-user", authMiddleware, updateUser);
router.get("/:id", authMiddleware, getUser);
router.delete("/:id", deleteUser);
router.get("/", getAllUser);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);

module.exports = router;
