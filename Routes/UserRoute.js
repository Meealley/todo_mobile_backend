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
router.get("/:id", authMiddleware, getUser);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);
router.get("/", getAllUser);
router.put("/update-user", authMiddleware, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
