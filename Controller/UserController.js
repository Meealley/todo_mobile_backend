const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const { generateRefreshToken } = require("../Config/refreshToken");
const { generateToken } = require("../Config/jwtToken");
const jwt = require('jsonwebtoken')

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
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not Found");
    }

    const correctPassword = await user.isPasswordMatched(password);
    if (user && correctPassword) {
      const refreshToken = await generateRefreshToken(user._id);
      const updateUser = await User.findByIdAndUpdate(
        user._id,
        {
          refreshToken: refreshToken,
        },
        {
          new: true,
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: user?._id,
        firstname: user?.firstname,
        lastname: user?.lastname,
        email: user?.email,
        mobile: user?.mobile,
        password: user?.password,
        token: generateToken(user._id),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    throw new Error("Invalid credentials");
  }
});

//HANDLE REFRESHTOKEN
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie)
  if (!cookie?.refreshToken)
    throw new Error("No Refresh token available in cookies");

  const refreshToken = cookie.refreshToken;
    console.log(refreshToken);

  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("User not found");

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    console.log(decoded);
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
    console.log(accessToken);
    res.json({ accessToken });
  });
  //   res.json(user);

  // console.log(cookie);
});

//UPDAT - Update a user
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
console.log(req.user)
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body.firstname,
        lastname: req?.body.lastname,
        email: req?.body.email,
        mobile: req?.body.mobile,
        password: req?.body.password,
      },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    throw new Error("Could not update user");
  }

  res.json({ message: "Updated" });
});

//DELETE - Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    res.json({
      status: "Deleted Successfully",
      message: user,
    });
  } catch (error) {
    throw new Error("Could not delete user");
  }
  //   res.json({ message: `Deleted user ${id}` });
});

//GET - Get a user BY ID
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    throw new Error("Could not get user by IDs");
  }
  //   res.json({ message: `Get user by ID ${id}` });
});

//GET - Get ALL user
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    throw new Error("Couldn't get all users");
  }

  //   res.json({ message: `Get all user list` });
});

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("No refresh token available in cookie");

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  handleRefreshToken,
  getAllUser,
  getUser,
  logoutUser,
};
