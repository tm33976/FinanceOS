const express = require("express");
const router = express.Router();
const { createUser, getUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateRegister } = require("../middleware/validate");

// All user management is admin-only
router.use(authenticate, authorize("admin"));

router.get("/", getUsers);
router.post("/", validateRegister, createUser);  // Admin creates a user
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;