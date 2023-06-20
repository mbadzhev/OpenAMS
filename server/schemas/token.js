const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  code: {
    type: Number,
  },
  creationDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
