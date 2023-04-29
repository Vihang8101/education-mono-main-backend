const { Schema, model } = require("mongoose");

const { titles, roles } = require("../utils/enums");

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String, required: true, enum: titles },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      enum: roles,
      default: "teacher",
    },
    password: { type: String },
    verified: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
    institute: { type: Schema.Types.ObjectId, ref: "Institute" },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = { User };
