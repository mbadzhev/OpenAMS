const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Create
router.post("/", async (req, res) => {
  try {
    const fields = req.body;
    const newUser = new User();
    Object.assign(newUser, fields);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .populate("modules", "name code")
      .populate("events", "module date location eventType attendanceType");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userId", getUser, (req, res) => {
  try {
    res.status(200).json(res.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.patch("/:userId", getUser, async (req, res) => {
  try {
    const updates = req.body;
    Object.assign(res.user, updates);
    const updatedUser = await res.user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete("/:userId", getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: "modules",
        select: "name code",
      })
      .populate({
        path: "events",
        select: "module date location eventType attendanceType",
        populate: {
          path: "attendance",
          // Only populate attendance for the given user ID
          match: { student: req.params.userId },
          select: "student present",
        },
      });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = router;
