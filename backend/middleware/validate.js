const { body, query, validationResult } = require("express-validator");

// Run this after validation rules to send back errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["admin", "analyst", "viewer"]).withMessage("Invalid role"),
  handleValidationErrors,
];

const validateRecord = [
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO date"),
  body("notes").optional().isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters"),
  handleValidationErrors,
];

module.exports = { validateLogin, validateRegister, validateRecord };
