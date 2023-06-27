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

userSchema.pre("save", { document: true }, async function (next) {
  try {
    const Module = mongoose.model("Module");
    const Event = mongoose.model("Event");
    const moduleIds = this.modules || [];
    const eventIds = this.events || [];

    // Update users in the associated modules
    await Module.updateMany(
      { _id: { $in: moduleIds } },
      { $addToSet: { students: this._id } }
    );
    // Remove users from modules they are no longer associated with
    await Module.updateMany(
      { _id: { $nin: moduleIds } },
      { $pull: { students: this._id } }
    );

    // Update users in the associated events
    await Event.updateMany(
      { _id: { $in: eventIds } },
      { $addToSet: { attendance: { student: this._id } } }
    );
    // Remove users from events they are no longer associated with
    await Event.updateMany(
      { _id: { $nin: eventIds } },
      { $pull: { attendance: { student: this._id } } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

// Remove object from referenced documents
userSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await this.model("Module").updateMany(
      { _id: this.modules },
      { $pull: { students: this._id } }
    );
    await this.model("Module").updateMany(
      { _id: this.modules },
      { $pull: { lecturers: this._id } }
    );
    await this.model("Event").updateMany(
      { _id: this.events },
      { $pull: { attendance: { student: this._id } } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
