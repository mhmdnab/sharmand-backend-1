const mongoose = require("mongoose");
require("dotenv").config();
const Admin = require("./models/Admin");
const connectDB = require("./db");

const manageAdmins = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Check current admin accounts
    const admins = await Admin.find({});
    console.log("Current admin accounts:");
    admins.forEach(admin => {
      console.log(`- ${admin.name} (${admin.email})`);
    });

    // Delete admin@admin.com if it exists
    const adminToDelete = await Admin.findOne({ email: "admin@admin.com" });
    if (adminToDelete) {
      await Admin.deleteOne({ email: "admin@admin.com" });
      console.log("✓ Deleted admin@admin.com account");
    } else {
      console.log("✗ admin@admin.com account not found");
    }

    // Ensure Omar_Sharamand@gmail.com exists
    let omarAdmin = await Admin.findOne({ email: "Omar_Sharamand@gmail.com" });
    
    if (!omarAdmin) {
      // Create Omar_Sharamand@gmail.com admin
      omarAdmin = new Admin({
        name: "Omar Sharamand",
        email: "Omar_Sharamand@gmail.com",
        password: "lo2005ha", // Using the same password from seed-admin.js
      });
      
      await omarAdmin.save();
      console.log("✓ Created Omar_Sharamand@gmail.com admin account");
    } else {
      console.log("✓ Omar_Sharamand@gmail.com admin account already exists");
    }

    // Verify final state
    const finalAdmins = await Admin.find({});
    console.log("\nFinal admin accounts:");
    finalAdmins.forEach(admin => {
      console.log(`- ${admin.name} (${admin.email})`);
    });

    if (finalAdmins.length === 1 && finalAdmins[0].email === "Omar_Sharamand@gmail.com") {
      console.log("\n✓ SUCCESS: Omar_Sharamand@gmail.com is the sole administrator account");
    } else {
      console.log("\n✗ WARNING: Multiple admin accounts still exist");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

manageAdmins();