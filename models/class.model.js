const { Schema, model } = require("mongoose");
const { examBoards, keyStages } = require("../utils/enums");

const classSchema = new Schema(
  {
    institute: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    name: { type: String, required: true },
    keyStage: { type: String, enum: keyStages },
    yearGroup: { type: Number },
    noOfStudents: { type: Number },
    examBoard: { type: String, enum: examBoards },
  },
  { timestamps: true }
);

const Class = model("Class", classSchema);

module.exports = { Class };
