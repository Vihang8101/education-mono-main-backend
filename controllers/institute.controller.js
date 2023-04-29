const { Institute } = require("../models/institute.model");
const instituteService = require("../services/institute.service");
const userService = require("../services/user.service");
const HTTP_STATUS = require("../utils/statusCodes");

/**
 * Creates a new institute
 */
const createInstitute = async (req, res, next) => {
  const { body } = req;

  try {
    const query = Object.keys(body).reduce((prev, curr) => {
      if (typeof body[curr] === "object") {
        const temp = {};
        Object.keys(body[curr]).forEach((key) => {
          temp[`${curr}.${key}`] = body[curr][key];
        });
        return { ...prev, ...temp };
      }
      return { ...prev, [curr]: body[curr] };
    }, {});
    const exists = await instituteService.exists(query);
    if (exists) {
      return next({
        status: HTTP_STATUS.BAD_REQUEST,
        message: "An institute with these details already exists.",
      });
    }

    const institute = await instituteService.create(body);

    return res.send(institute);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Get institutes filtered by query, selected columns & pagination
 */
const getInstitutes = async (req, res, next) => {
  const { sortBy = "updatedAt", query = {} } = req.query;
  let {
    fields = ["name", "address", "createdAt", "updatedAt"],
    page = 1,
    perPage = 5,
    order = -1,
  } = req.query;

  // Convert string to number
  page = parseInt(page, 10);
  perPage = parseInt(perPage, 10);
  order = parseInt(order, 10);

  try {
    fields = {
      _id: 1,
      ...fields.reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {}),
    };

    const dbQuery = Object.keys(query).reduce((prev, curr) => {
      if (curr === "search") {
        if (query[curr]) {
          const regex = { $regex: query[curr], $options: "i" };
          return {
            ...prev,
            $or: [
              { name: regex },
              { level: regex },
              { type: regex },
              { "address.territory": regex },
            ],
          };
        }
        return prev;
      }

      if (Array.isArray(query[curr]))
        return {
          ...prev,
          [curr]: {
            $in: query[curr],
          },
        };
      return { ...prev, [curr]: query[curr] };
    }, {});

    const totalCount = await instituteService.getCount(dbQuery);
    const institutes = await Institute.aggregate()
      .match(dbQuery)
      .sort({ [sortBy]: order })
      .project(fields)
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.send({
      totalPages: Math.ceil(totalCount / perPage),
      totalCount,
      data: institutes,
      page,
      perPage,
      sortBy,
      fields: Object.keys(fields),
      order,
      query,
      allFields: [
        "name",
        "address",
        "level",
        "type",
        "homePage",
        "noOfStudents",
        "createdAt",
        "updatedAt",
      ],
    });
  } catch (error) {
    return next({ error, message: error.message });
  }
};

/**
 * Get institute by id
 */
const getInstituteById = async (req, res, next) => {
  const { instituteId } = req.params;

  try {
    const institute = await instituteService.getById(instituteId);

    if (!institute) {
      return next({
        status: HTTP_STATUS.BAD_REQUEST,
        error: { message: "Institute does not exist." },
      });
    }

    return res.send(institute);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Get institutes list
 */
const getInstituteList = async (req, res, next) => {
  try {
    const list = await instituteService.getList();

    return res.send(list);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Update institute by id
 */
const updateInstituteById = async (req, res, next) => {
  const { instituteId } = req.params;

  try {
    const institute = await instituteService.updateById(instituteId, req.body);
    return res.send(institute);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Deletes institute by id
 */
const deleteInstituteById = async (req, res, next) => {
  const { instituteId } = req.params;

  try {
    const existsInUser = await userService.exists({ institute: instituteId });
    if (existsInUser)
      return next({
        message:
          "Institute cannot be deleted because there are accounts associated with it.",
      });

    const institute = await instituteService.deleteById(instituteId);

    if (!institute)
      return next({
        status: HTTP_STATUS.BAD_REQUEST,
        error: { message: "Invalid institute id." },
      });

    return res.send(institute);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Search institute by name
 */
const searchInstitutes = async (req, res, next) => {
  try {
    const list = await instituteService.searchByName(req.query.search);

    return res.send(list);
  } catch (error) {
    return next({ error });
  }
};

module.exports = {
  createInstitute,
  getInstitutes,
  getInstituteById,
  searchInstitutes,
  getInstituteList,
  updateInstituteById,
  deleteInstituteById,
};
