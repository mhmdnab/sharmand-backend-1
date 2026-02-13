const mongoose = require("mongoose");
require("dotenv").config();
const Admin = require("./models/Admin");
const connectDB = require("./db");

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "Omar_Sharamand@gmail.com" });

    if (existingAdmin) {
      console.log("✓ Admin user already exists");
      process.exit(0);
    }

    // Create new admin user
    const admin = new Admin({
      name: "Admin",
      email: "Omar_Sharamand@gmail.com",
      password: "",
    });

    await admin.save();
    console.log("✓ Successfully created admin user");
    console.log(`  - Email: Omar_Sharamand@gmail.com`);
    console.log(`  - Password: lo2005ha`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
lo2005ha