const express = require("express");
const {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  getAllUser,
} = require("../Controller/UserController");
const router = express.Router();

router.post("/register", createUser);
router.put("/update-user", updateUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.get("/", getAllUser);

module.exports = router;
