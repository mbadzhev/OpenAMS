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

eventSchema.pre("save", { document: true }, async function (next) {
  try {
    const Module = mongoose.model("Module");
    const User = mongoose.model("User");
    const Token = mongoose.model("Token");
    const moduleIds = this.module || [];
    const studentIds =
      this.attendance.map((attendance) => attendance.student) || [];
    const tokenIds = this.tokens || [];

    // Update events in associated modules
    await Module.updateMany(
      { _id: { $in: moduleIds } },
      { $addToSet: { events: this._id } }
    );
    // Remove events from modules they are no longer associated with
    await Module.updateMany(
      { _id: { $nin: moduleIds } },
      { $pull: { events: this._id } }
    );

    // Update users in associated events
    await User.updateMany(
      { _id: { $in: studentIds } },
      { $addToSet: { events: this._id } }
    );
    // Remove events from users they are no longer associated with
    await User.updateMany(
      { _id: { $nin: studentIds } },
      { $pull: { events: this._id } }
    );

    // Update event references in associated tokens
    await Token.updateMany(
      { _id: { $in: tokenIds } },
      { $set: { event: this._id } }
    );
    // Remove event references from tokens they are no longer associated with
    await Token.updateMany(
      { _id: { $nin: tokenIds } },
      { $unset: { event: this._id } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

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
