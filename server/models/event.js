const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    location: {
      type: String,
      required: function () {
        return this.eventType !== "online";
      },
    },
    eventType: {
      type: String,
      enum: ["online", "in-person", "hybrid"],
      required: true,
    },
    attendanceType: {
      type: String,
      enum: ["optional", "mandatory"],
      required: true,
    },
    attendance: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        present: {
          type: Boolean,
          default: false,
        },
      },
    ],
    tokens: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Token",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
