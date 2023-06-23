const express = require("express");
const router = express.Router();
const Module = require("../models/module");

// Create
router.post("/", async (req, res) => {
  try {
    const { name, lecturers, students, events } = req.body;
    const newModule = new Module({
      name,
      lecturers,
      students,
      events,
    });
    await newModule.save();
    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read
router.get("/", async (req, res) => {
  try {
    let query = Module.find();
    if (query.length > 0 && query.lecturers.length > 0) {
      query = query.populate({ path: "lecturers" });
    }
    if (query.length > 0 && query.students.length > 0) {
      query = query.populate({ path: "students" });
    }
    if (query.length > 0 && query.events.length > 0) {
      query = query.populate({ path: "events" });
    }
    const modules = await query.exec();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:moduleId", getModule, (req, res) => {
  try {
    res.status(200).json(res.module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.patch("/:moduleId", getModule, async (req, res) => {
  if (req.body.name) {
    res.module.name = req.body.name;
  }
  if (req.body.lecturers) {
    res.module.lecturers = req.body.lecturers;
  }
  if (req.body.students) {
    res.module.students = req.body.students;
  }
  if (req.body.events) {
    res.module.events = req.body.events;
  }
  try {
    const updatedModule = await res.module.save();
    res.status(200).json(updatedModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete("/:moduleId", getModule, async (req, res) => {
  try {
    await res.module.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware
async function getModule(req, res, next) {
  try {
    let query = Module.findById(req.params.moduleId);
    if (query.length > 0 && query.lecturers.length > 0) {
      query = query.populate({ path: "lecturers" });
    }
    if (query.length > 0 && query.students.length > 0) {
      query = query.populate({ path: "students" });
    }
    if (query.length > 0 && query.events.length > 0) {
      query = query.populate({ path: "events" });
    }
    const module = await query.exec();
    if (!module) {
      return res.status(404).json({ error: "Module not found." });
    }
    res.module = module;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = router;
