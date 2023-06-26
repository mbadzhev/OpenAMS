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

// Remove object from referenced documents
eventSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await this.model("Module").updateOne(
      { _id: this.module },
      { $pull: { events: this._id } }
    );
    await this.model("User").updateMany(
      { _id: this.attendance.student },
      { $pull: { events: this._id } }
    );
    await this.model("Token").updateMany(
      { _id: this.tokens },
      { $unset: { event: this._id } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Event", eventSchema);
