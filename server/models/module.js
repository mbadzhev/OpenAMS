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
