const { Schema, model } = require("mongoose");
const {
  territories,
  instituteLevels,
  instituteTypes,
} = require("../utils/enums");

const instituteSchema = new Schema(
  {
    name: { type: String, required: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      town: { type: String, required: true },
      postCode: { type: String, required: true },
      territory: { type: String, required: true, enum: territories },
      county: { type: String },
      localAuthority: { type: String, required: true },
    },
    level: { type: String, required: true, enum: instituteLevels },
    type: { type: String, enum: instituteTypes },
    homePage: { type: String },
    noOfStudents: { type: Number },
  },
  { timestamps: true }
);

const Institute = model("Institute", instituteSchema);

module.exports = { Institute };
