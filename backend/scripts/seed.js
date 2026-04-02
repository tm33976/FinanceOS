require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Record = require("../models/Record");

const categories = {
  income: ["Salary", "Freelance", "Investments", "Rental", "Bonus", "Other Income"],
  expense: ["Food", "Transport", "Utilities", "Rent", "Entertainment", "Healthcare", "Shopping", "Education"],
};

const randomBetween = (min, max) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

const randomDate = (monthsBack) => {
  const d = new Date();
  d.setMonth(d.getMonth() - Math.floor(Math.random() * monthsBack));
  d.setDate(Math.floor(Math.random() * 28) + 1);
  return d;
};

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await User.deleteMany({});
  await Record.deleteMany({});
  console.log("Cleared existing data");

  // Create demo users
  const users = await User.create([
    { name: "Admin User", email: "admin@demo.com", password: "password123", role: "admin" },
    { name: "Alice Analyst", email: "analyst@demo.com", password: "password123", role: "analyst" },
    { name: "Victor Viewer", email: "viewer@demo.com", password: "password123", role: "viewer" },
  ]);

  const admin = users[0];
  console.log("Created users");

  // Generate 12 months of realistic financial records for the admin user
  const records = [];
  for (let i = 0; i < 150; i++) {
    const type = Math.random() > 0.4 ? "expense" : "income";
    const categoryList = categories[type];
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];

    records.push({
      amount: type === "income" ? randomBetween(500, 5000) : randomBetween(20, 800),
      type,
      category,
      date: randomDate(12),
      notes: `${category} ${type} record`,
      userId: admin._id,
    });
  }

  await Record.insertMany(records);
  console.log(`Created ${records.length} financial records`);

  console.log("\n✅ Seed complete!");
  console.log("Demo accounts:");
  console.log("  admin@demo.com   / password123  (Admin)");
  console.log("  analyst@demo.com / password123  (Analyst)");
  console.log("  viewer@demo.com  / password123  (Viewer)");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
