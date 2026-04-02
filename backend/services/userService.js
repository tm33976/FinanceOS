const User = require("../models/User");

// Admin creates a user directly — no public registration needed
const createUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("A user with this email already exists");
    err.statusCode = 409;
    throw err;
  }

  // Password hashing is handled by the pre-save hook in the User model
  const user = await User.create({ name, email, password, role });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

const getUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 }).lean();
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const updateUser = async (id, data) => {
  // Never let someone update their own password via this route
  delete data.password;

  const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select(
    "-password"
  );

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };