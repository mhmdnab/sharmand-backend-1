const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// @route   POST api/admin/register
// @desc    Register an admin
// @access  Public (only for the first time)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    admin = new Admin({
      name,
      email,
      password,
    });

    await admin.save();

    const payload = {
      admin: {
        id: admin.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // 7 days instead of 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          name: admin.name,
          email: admin.email,
          isAdmin: true,
        });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      admin: {
        id: admin.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // 7 days instead of 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          name: admin.name,
          email: admin.email,
          isAdmin: true,
        });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/admin/:email
// @desc    Delete an admin account
// @access  Private (admin only)
router.delete("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // Find the admin to be deleted
    const adminToDelete = await Admin.findOne({ email });

    if (!adminToDelete) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // Prevent deletion of the last admin account
    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins <= 1) {
      return res.status(400).json({ msg: "Cannot delete the last admin account" });
    }

    // Delete the admin
    await Admin.deleteOne({ email });

    res.json({ msg: `Admin account ${email} has been deleted successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
