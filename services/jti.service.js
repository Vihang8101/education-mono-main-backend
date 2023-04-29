const { randomUUID } = require("node:crypto");
const { JTI } = require("../models/jti.model");

const create = async (userId) => {
  const jti = new JTI({ user: userId, token: randomUUID() });
  await jti.save();
  return jti;
};
const get = async (query) => JTI.findOne(query);
const getByUser = async (user) => JTI.find({ user }, "_id createdAt");
const deleteManyByUserId = async (userId) => JTI.deleteMany({ user: userId });
const deleteByToken = async (token) => JTI.findOneAndDelete({ token });
const deleteAll = async (user, jti) =>
  JTI.deleteMany({ user, token: { $not: jti } });

module.exports = {
  create,
  get,
  deleteManyByUserId,
  getByUser,
  deleteByToken,
  deleteAll,
};
