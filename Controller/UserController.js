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
      res.json(user);
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    throw new Error("Invalid credentials");
  }
});

//UPDAT - Update a user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
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
    throw new Error("Counld not update user");
  }

  res.json({ message: "Updated" });
});

//DELETE - Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id)
    res.json({
        status : "Deleted Successfully",
        message : user,
    })
  } catch (error) {
    throw new Error("Could not delete user")
  }
//   res.json({ message: `Deleted user ${id}` });
});

//GET - Get a user BY ID
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
try {
    const user = await User.findById(id)
    res.json(user);
} catch (error) {
    
}
//   res.json({ message: `Get user by ID ${id}` });
});

//GET - Get ALL user
const getAllUser = asyncHandler(async (req, res) => {
try {
    const user = await User.find()
    res.json(user);

} catch (error) {
    throw new Error("Couldn't get all users")
}

//   res.json({ message: `Get all user list` });
});

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getUser,
};
