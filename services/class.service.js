const { Class } = require("../models/class.model");

const create = async (data) => {
  const doc = new Class(data);
  await doc.save();
  return doc;
};
const exists = async (query) => Class.exists(query);
const getById = async (id) => Class.findById(id);
const updateById = async (id, data) =>
  Class.findByIdAndUpdate(id, data, { new: true });
const deleteById = async (id) => Class.findByIdAndDelete(id);

module.exports = { exists, create, getById, updateById, deleteById };
