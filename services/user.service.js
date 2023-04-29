const { User } = require("../models/user.model");

const get = async (query) => User.findOne(query);
const getById = async (id, projection = "") =>
  User.findById(id).select(projection);
const exists = async (query) => User.exists(query);
const create = async (data) => {
  const user = new User(data);
  await user.save();
  return user;
};
const updateById = async (id, data) => {
  const mutation = { ...data };
  if (mutation?.institute === "") {
    delete mutation.institute;
    mutation.$unset = { institute: 1 };
  }
  return User.findByIdAndUpdate(id, mutation, { new: true });
};
const deleteById = async (id) => User.findByIdAndDelete(id);

module.exports = { get, getById, exists, create, updateById, deleteById };
