const express = require("express");
const router = express.Router();
const { getRecords, createRecord, updateRecord, deleteRecord } = require("../controllers/recordController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateRecord } = require("../middleware/validate");

// All record routes require authentication
router.use(authenticate);

// Viewers and above can read records
router.get("/", getRecords);

// Only admin and analyst can create/update/delete
router.post("/", authorize("admin", "analyst"), validateRecord, createRecord);
router.put("/:id", authorize("admin", "analyst"), validateRecord, updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

module.exports = router;
