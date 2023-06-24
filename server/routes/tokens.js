const express = require("express");
const router = express.Router();
const Token = require("../models/token");

// Create
router.post("/", async (req, res) => {
  try {
    const fields = req.body;
    const newToken = new Token();
    Object.assign(newToken, fields);
    await newToken.save();
    res.status(201).json(newToken);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read
router.get("/", async (req, res) => {
  try {
    const tokens = await Token.find();
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:tokenId", getToken, (req, res) => {
  try {
    res.status(200).json(res.token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.patch("/:tokenId", getToken, async (req, res) => {
  try {
    const updates = req.body;
    Object.assign(res.token, updates);
    const updatedToken = await res.token.save();
    res.status(200).json(updatedToken);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete("/:tokenId", getToken, async (req, res) => {
  try {
    await res.token.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware
async function getToken(req, res, next) {
  try {
    const token = await Token.findById(req.params.tokenId);
    if (!token) {
      return res.status(404).json({ error: "Token not found." });
    }
    res.token = token;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = router;
