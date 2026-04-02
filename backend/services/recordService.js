const Record = require("../models/Record");

// TODO: might be worth adding a search by notes field later
const buildFilter = ({ type, category, startDate, endDate }) => {
  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = { $regex: category, $options: "i" };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  return filter;
};

const getRecords = async (queryParams) => {
  const { page = 1, limit = 20, sortBy = "date", sortOrder = "desc" } = queryParams;
  const filter = buildFilter(queryParams);

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [records, total] = await Promise.all([
    Record.find(filter)
      .populate("userId", "name email") // show who created the record
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Record.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  };
};

const createRecord = async (userId, data) => {
  // Still track who created it, but it's visible to everyone
  const record = await Record.create({ ...data, userId });
  return record.populate("userId", "name email");
};

const updateRecord = async (recordId, data) => {
  // Any analyst/admin can update any record — no ownership check
  const record = await Record.findByIdAndUpdate(
    recordId,
    data,
    { new: true, runValidators: true }
  ).populate("userId", "name email");

  if (!record) {
    const err = new Error("Record not found");
    err.statusCode = 404;
    throw err;
  }

  return record;
};

const deleteRecord = async (recordId) => {
  const record = await Record.findByIdAndDelete(recordId);

  if (!record) {
    const err = new Error("Record not found");
    err.statusCode = 404;
    throw err;
  }

  return record;
};

module.exports = { getRecords, createRecord, updateRecord, deleteRecord };