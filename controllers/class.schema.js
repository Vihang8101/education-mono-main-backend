const Joi = require("joi").extend(require("@joi/date"));
const { keyStages, examBoards } = require("../utils/enums");
const HTTP_STATUS = require("../utils/statusCodes");

/**
 * Determines if provided data is valid to create a new class document
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createClass = (req, res, next) => {
  const classSchema = Joi.object({
    name: Joi.string().required(),
    keyStage: Joi.string().valid(...keyStages),
    yearGroup: Joi.date().format("YYYY"),
    noOfStudents: Joi.number().positive().integer(),
    examBoard: Joi.string().valid(...examBoards),
    institute: Joi.string().hex().length(24).required(),
  });

  // Handle errors
  const { error } = classSchema.validate(req.body, { abortEarly: false });
  if (error)
    return next({ status: HTTP_STATUS.BAD_REQUEST, error: error.details });

  return next();
};

/**
 * Validates class update data
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateClass = (req, res, next) => {
  const classUpdateSchema = Joi.object({
    name: Joi.string(),
    keyStage: Joi.string().valid(...keyStages),
    yearGroup: Joi.date().format("YYYY"),
    noOfStudents: Joi.number().positive().integer(),
    examBoard: Joi.string().valid(...examBoards),
    institute: Joi.string().hex().length(24),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required.",
    });

  const { error } = classUpdateSchema.validate(req.body, { abortEarly: false });
  if (error)
    return next({ status: HTTP_STATUS.BAD_REQUEST, error: error.details });

  return next();
};

module.exports = { createClass, updateClass };
