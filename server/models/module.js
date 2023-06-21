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

module.exports = mongoose.model("Module", moduleSchema);
