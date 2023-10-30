const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");

//POST - Create a new user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } else {
    throw new Error("User already exists");
  }

  //   res.json({ message: "Created a new user" });
});

//POST - LOGIN USER
const loginUser = asyncHandler(async (req, res) => {});

//UPDAT - Update a user
const updateUser = asyncHandler(async (req, res) => {
  res.json({ message: "Updated" });
});

//DELETE - Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Deleted user ${id}` });
});

//GET - Get a user BY ID
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get user by ID ${id}` });
});

//GET - Get ALL user
const getAllUser = asyncHandler(async (req, res) => {
  res.json({ message: `Get all user list` });
});

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
  getUser,
};
