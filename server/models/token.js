const mongoose = require("mongoose");
const { generateRandomDigits } = require("../functions/helpers");

const tokenSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: true,
      default: generateRandomDigits(6),
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    expiredAt: {
      type: Date,
      required: true,
      default: Date.now() + 5 * 60 * 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
