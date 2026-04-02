const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ message: "Registration successful", ...result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ message: "Login successful", ...result });
  } catch (err) {
    next(err);
  }
};

const getMe = (req, res) => {
  // req.user is attached by the authenticate middleware
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

module.exports = { register, login, getMe };
