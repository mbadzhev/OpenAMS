const mongoose = require("mongoose");
const { generateRandomDigits } = require("../functions/helpers");
const Event = require("./event");

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

// Remove object from referenced documents
tokenSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await this.model("Event").updateOne(
      { _id: this.event },
      { $pull: { tokens: this._id } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Token", tokenSchema);
