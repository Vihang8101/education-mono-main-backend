const { Institute } = require("../models/institute.model");

const exists = async (data) => Institute.exists(data);

const create = async (data) => {
  const institute = new Institute(data);
  await institute.save();

  return institute;
};

const getById = async (id) => Institute.findById(id);

const getList = async (query) =>
  Institute.find(query, "_id name", { sort: "name" });

const searchByName = async (string) => {
  if (string) {
    return Institute.find({ name: { $regex: string, $options: "i" } })
      .limit(5)
      .select("name");
  }
  return Institute.find().limit(5).select("name");
};

const getCount = async (query) => Institute.count(query);

const updateById = async (id, data) =>
  Institute.findByIdAndUpdate(id, data, { new: true });

const deleteById = async (id) => Institute.findByIdAndDelete(id);

module.exports = {
  exists,
  create,
  getById,
  getList,
  getCount,
  updateById,
  deleteById,
  searchByName,
};
