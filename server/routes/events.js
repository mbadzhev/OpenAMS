const express = require("express");
const router = express.Router();
const Event = require("../models/event");

// Create
router.post("/", async (req, res) => {
  try {
    const fields = req.body;
    const newEvent = new Event();
    Object.assign(newEvent, fields);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("module", "name code")
      .populate("attendance.student", "firstName lastName number")
      .populate("tokens");

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:eventId", getEvent, (req, res) => {
  try {
    res.status(200).json(res.event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.patch("/:eventId", getEvent, async (req, res) => {
  try {
    const updates = req.body;
    Object.assign(res.event, updates);
    const updatedEvent = await res.event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete("/:eventId", getEvent, async (req, res) => {
  try {
    await res.event.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware
async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate("module", "name code")
      .populate("attendance.student", "firstName lastName number");

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }
    res.event = event;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = router;
