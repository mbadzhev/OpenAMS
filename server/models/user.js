const mongoose = require("mongoose");
const { generateUserNumber } = require("../functions/helpers");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      unique: true,
      default: generateUserNumber,
    },
    role: {
      type: String,
      enum: ["student", "lecturer", "admin"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
