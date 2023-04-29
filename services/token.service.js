const { randomUUID } = require("node:crypto");
const { Token, getTokenExpiry } = require("../models/token.model");

const create = async (user) => {
  const token = await randomUUID();

  const doc = await Token.findOneAndUpdate(
    { user },
    { token, expiresAt: getTokenExpiry() },
    { upsert: true, new: true }
  );

  return doc;
};

const getByToken = async (token) => Token.findOne({ token });

const deleteByToken = async (token) => Token.findOneAndDelete({ token });

module.exports = { create, getByToken, deleteByToken };
