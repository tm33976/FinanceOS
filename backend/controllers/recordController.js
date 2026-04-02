const recordService = require("../services/recordService");

const getRecords = async (req, res, next) => {
  try {
    const result = await recordService.getRecords(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createRecord = async (req, res, next) => {
  try {
    // Pass the logged-in user's id so we know who created it
    const record = await recordService.createRecord(req.user._id, req.body);
    res.status(201).json({ message: "Record created", record });
  } catch (err) {
    next(err);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    // No ownership check — any analyst/admin can edit any record
    const record = await recordService.updateRecord(req.params.id, req.body);
    res.json({ message: "Record updated", record });
  } catch (err) {
    next(err);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    await recordService.deleteRecord(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecords, createRecord, updateRecord, deleteRecord };