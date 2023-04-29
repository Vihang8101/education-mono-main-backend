const { ObjectId } = require("mongoose").Types;
const { Class } = require("../models/class.model");
const classService = require("../services/class.service");
const HTTPS_STATUS = require("../utils/statusCodes");

/**
 * Inserts a new class document into classes collection
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createClass = async (req, res, next) => {
  const value = req.body;

  try {
    const doc = await classService.create(value);

    return res.send(doc);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Updates a class document
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateClass = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const doc = await classService.updateById(classId, req.body);
    if (!doc)
      return next({
        status: HTTPS_STATUS.BAD_REQUEST,
        error: { message: "Invalid class id." },
      });
    return res.send(doc);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Delete a class document by id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteClassById = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const doc = await classService.deleteById(classId);
    if (!doc)
      return next({
        status: HTTPS_STATUS.BAD_REQUEST,
        error: { message: "Invalid class id." },
      });

    return res.send(doc);
  } catch (error) {
    return next({ error });
  }
};

/**
 * Get list of class
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getClasses = async (req, res, next) => {
  const { sortBy = "updatedAt", query = {} } = req.query;
  let {
    fields = ["name", "keyStage", "examBoard", "createdAt", "updatedAt"],
    page = 1,
    perPage = 5,
    order = -1,
  } = req.query;

  // Convert string to number
  page = parseInt(page, 10) - 1;
  perPage = parseInt(perPage, 10);
  order = parseInt(order, 10);
  try {
    fields = {
      _id: 1,
      institute: 1,
      ...fields.reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {}),
    };

    // Create search query
    const searchQuery = () => {
      if (query?.search) {
        const regex = { $regex: query.search, $options: "i" };

        return {
          $or: [
            { name: regex },
            { keyStage: regex },
            { examBoard: regex },
            { "institute.name": regex },
          ],
        };
      }
      return {};
    };

    // Create mongodb query from params
    const dbQuery = Object.keys(query).reduce((prev, curr) => {
      if (Array.isArray(query[curr])) {
        if (curr === "institute") {
          const ids = query[curr].map((i) => new ObjectId(i._id));
          return {
            ...prev,
            [curr]: {
              $in: ids,
            },
          };
        }

        return {
          ...prev,
          [curr]: {
            $in: query[curr],
          },
        };
      }

      if (curr === "search") {
        return prev;
      }

      return { ...prev, [curr]: query[curr] };
    }, {});

    const classes = await Class.aggregate()
      .match(dbQuery)
      .lookup({
        from: "institutes",
        localField: "institute",
        foreignField: "_id",
        as: "institute",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
      })
      .project(fields)
      .unwind({ path: "$institute", preserveNullAndEmptyArrays: true })
      .match(searchQuery())
      .facet({
        count: [{ $count: "total" }],
        data: [
          { $skip: perPage * page },
          {
            $limit: perPage,
          },
          {
            $sort: { [sortBy]: order },
          },
        ],
      });

    const totalCount = classes[0].count[0]?.total;

    return res.send({
      totalPages: Math.ceil(totalCount / perPage),
      totalCount,
      data: classes[0].data,
      page: page + 1,
      perPage,
      sortBy,
      fields: Object.keys(fields),
      allFields: [
        "institute",
        "name",
        "keyStage",
        "yearGroup",
        "noOfStudents",
        "examBoard",
        "createdAt",
        "updatedAt",
      ],
      order,
      query,
    });
  } catch (error) {
    return next({ error });
  }
};

/**
 * Get a class by class id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getClassById = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const doc = await (
      await classService.getById(classId)
    ).populate("institute", "name");

    // Check if class exists
    if (!doc)
      return next({
        status: HTTPS_STATUS.BAD_REQUEST,
        error: { message: "Class does not exist." },
      });

    return res.send(doc);
  } catch (error) {
    return next({ error });
  }
};

module.exports = {
  createClass,
  updateClass,
  deleteClassById,
  getClasses,
  getClassById,
};
