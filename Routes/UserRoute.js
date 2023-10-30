const express = require("express");
const {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  getAllUser,
  loginUser,
} = require("../Controller/UserController");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/update-user/:id", updateUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.get("/", getAllUser);

module.exports = router;
