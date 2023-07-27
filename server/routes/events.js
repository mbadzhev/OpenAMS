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

// Update student attendance - lecturer
router.patch("/:eventId/:userId", getEvent, async (req, res) => {
  try {
    const studentNumber = req.params.userId;
    const studentIndex = res.event.attendance.findIndex(
      (item) => item && item.student._id == studentNumber
    );

    if (studentIndex === -1) {
      return res
        .status(404)
        .json({ error: "Student not found in attendance." });
    }

    const studentPresent = res.event.attendance[studentIndex].present;

    if (studentPresent) {
      // Mark student as absent
      res.event.attendance[studentIndex].present = false;
    } else {
      // Mark student as present
      res.event.attendance[studentIndex].present = true;
    }

    const eventUpdate = await res.event.save();
    res.status(200).json(eventUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student attendance - student
router.patch("/:eventId/:userId/:code", getEvent, async (req, res) => {
  try {
    const studentNumber = req.params.userId;
    const tokenCode = req.params.code;
    const studentIndex = res.event.attendance.findIndex(
      (item) => item && item.student._id == studentNumber
    );
    const studentPresent = res.event.attendance[studentIndex].present;

    if (studentPresent) {
      return res.status(304).json({ message: "Already checked in." });
    } else {
      let codeCorrect = false;
      res.event.tokens.forEach((token) => {
        if (token.code == tokenCode && token.expiredAt >= new Date()) {
          codeCorrect = true;
          res.event.attendance[studentIndex].present = true;
        }
      });
      if (codeCorrect == false) {
        return res.status(400).json({ error: "Code invalid." });
      }
    }
    const eventUpdate = await res.event.save();
    res.status(200).json(eventUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      .populate("attendance.student", "firstName lastName number")
      .populate("tokens", "code expiredAt");

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
