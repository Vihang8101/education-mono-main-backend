const {
  Types: { ObjectId },
} = require("mongoose");
const instituteService = require("../services/institute.service");

const injectInstitute = async (req, res, next) => {
  const { user } = res.locals;
  if (user.role === "super-admin") return next();

  const institute = await instituteService.getById(user.institute);

  req.query = {
    ...req.query,
    query: {
      ...req.query.query,
      institute: [{ _id: new ObjectId(user.institute), name: institute.name }],
    },
  };

  res.locals.injected = true;

  return next();
};

module.exports = injectInstitute;
