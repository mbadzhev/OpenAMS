const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Create
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, role, email, modules, events } = req.body;
    const user = new User({
      firstName,
      lastName,
      role,
      email,
      modules,
      events,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
});

router.get("/:userId", getUser, (req, res) => {
  try {
    res.status(200).json(res.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update
router.patch("/:userId", getUser, async (req, res) => {
  if (req.body.firstName) {
    res.user.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    res.user.lastName = req.body.lastName;
  }
  if (req.body.email) {
    res.user.email = req.body.email;
  }
  if (req.body.role) {
    res.user.role = req.body.role;
  }
  try {
    const updatedUser = await res.user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Middleware
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.userId)
      .populate("modules", "name code")
      .populate("events", "module date location eventType attendanceType");
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
