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
