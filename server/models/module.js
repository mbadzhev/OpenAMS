const mongoose = require("mongoose");
const { generateModuleCode } = require("../functions/helpers");

const moduleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      default: generateModuleCode,
    },
    lecturers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

// only users with lecturer role can be set as module lecturers
moduleSchema.pre("save", function (next) {
  const User = mongoose.model("User");
  const lecturers = this.lecturers || [];
  User.countDocuments({ _id: { $in: lecturers }, role: "lecturer" })
    .then((count) => {
      if (count !== lecturers.length) {
        throw new Error("Invalid lecturer ID.");
      }
      next();
    })
    .catch((error) => {
      next(error);
    });
});

moduleSchema.pre("save", { document: true }, async function (next) {
  try {
    const User = mongoose.model("User");
    const Event = mongoose.model("Event");
    const studentIds = this.students || [];
    const lecturerIds = this.lecturers || [];
    const eventIds = this.events || [];

    // Update modules in associated students and lecturers
    await User.updateMany(
      { _id: { $in: [...studentIds, ...lecturerIds] } },
      { $addToSet: { modules: this._id } }
    );
    // Remove modules from students and lecturers they are no longer associated with
    await User.updateMany(
      { _id: { $nin: [...studentIds, ...lecturerIds] } },
      { $pull: { modules: this._id } }
    );
    // Update modules in associated events
    await Event.updateMany(
      { _id: { $in: eventIds } },
      { $set: { module: this._id } }
    );
    // Remove modules from event they are no longer associated with
    await Event.updateMany(
      { _id: { $nin: eventIds } },
      { $unset: { module: this._id } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

// Remove object from referenced documents
moduleSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await this.model("Event").updateMany(
      { _id: this.events },
      { $unset: { module: this._id } }
    );
    await this.model("User").updateMany(
      { _id: this.students },
      { $pull: { modules: this._id } }
    );
    await this.model("User").updateMany(
      { _id: this.lecturers },
      { $pull: { modules: this._id } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Module", moduleSchema);
