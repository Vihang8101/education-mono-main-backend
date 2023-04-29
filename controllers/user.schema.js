const Joi = require("joi");
const { titles, roles } = require("../utils/enums");
const HTTP_STATUS = require("../utils/statusCodes");

/**
 * Validates registration details
 */
const register = (req, res, next) => {
  const registerSchema = Joi.object({
    firstName: Joi.string().required().min(2).max(20),
    lastName: Joi.string().required().min(2).max(20),
    title: Joi.string()
      .valid(...titles)
      .required(),
    email: Joi.string().email().required().messages({
      "string.email": "Email is invalid.",
    }),
    institute: Joi.string().hex().length(24).required(),
  });

  const { error } = registerSchema.validate(req.body);

  if (error)
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      error: error.details,
      message: error.message,
    });

  return next();
};

/**
 * Validate create user details
 */
const createUser = (req, res, next) => {
  const { user } = res.locals;

  function getValidRoles() {
    if (user.role === "super-admin") return roles;
    return ["institute-admin", "teacher"];
  }

  const userSchema = Joi.object({
    firstName: Joi.string().required().min(2).max(20),
    lastName: Joi.string().required().min(2).max(20),
    title: Joi.string()
      .valid(...titles)
      .required(),
    email: Joi.string().email().required().messages({
      "string.email": "Email is invalid.",
    }),
    role: Joi.string()
      .valid(...getValidRoles())
      .required(),
    institute: Joi.when("role", {
      is: Joi.string().valid("institute-admin", "teacher"),
      then: Joi.string().hex().length(24).required(),
    }),
  });

  const { error } = userSchema.validate(req.body, { abortEarly: false });
  
  // Handle errors
  if (error) {
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      message: error.message,
      error: error.details,
    });
  }

  // Go to next if no errors
  return next();
};

/**
 * Validate login details
 */
const login = (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email is invalid.",
    }),
    password: Joi.string().required(),
  });

  const { error } = loginSchema.validate(req.body);

  // Handle errors
  if (error) {
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      error: error.details,
      message: error.message,
    });
  }

  return next();
};

/**
 * Validates email
 */
const email = async (req, res, next) => {
  const emailSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email is invalid.",
    }),
  });

  const { error } = emailSchema.validate(req.body);

  // Handle error
  if (error) {
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      error: error.details,
      message: error.message,
    });
  }

  return next();
};

/**
 *  Validate create password details
 */
const password = (req, res, next) => {
  const passwordSchema = Joi.object({
    password: Joi.string()
      .min(8)
      .custom((value, helpers) => {
        if (!value.match(/[0-9]/)) {
          return helpers.message("Password must contain at least one number.");
        }
        if (!value.match(/[A-Z]/)) {
          return helpers.message(
            "Password must contain at least one capital letter."
          );
        }
        if (!value.match(/[!@#$%^&*]/)) {
          return helpers.message(
            "Password must contain at least one special character. (!,@,#,$,%,^,&,*)"
          );
        }
        return value;
      })
      .required(),
  });

  const { error } = passwordSchema.validate(req.body, {
    abortEarly: false,
  });

  // Handle errors
  if (error) {
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      message: error.message,
      error: error.details,
    });
  }

  // Go to next if no errors
  return next();
};

/**
 * Validate update user details
 */
const updateUser = (req, res, next) => {
  const { user } = res.locals;

  function getValidRoles() {
    if (user.role === "super-admin") return roles;
    return ["institute-admin", "teacher"];
  }

  const updateUserSchema = Joi.object({
    firstName: Joi.string().min(2).max(20),
    lastName: Joi.string().min(2).max(20),
    title: Joi.string().valid(...titles),
    email: Joi.string().email().messages({
      "string.email": "Email is invalid.",
    }),
    role: Joi.string().valid(...getValidRoles()),
    institute: Joi.string().hex().length(24).allow(""),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required.",
    });

  const { error } = updateUserSchema.validate(req.body);

  if (error) {
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      message: error.message,
      error: error.details,
    });
  }

  return next();
};

/**
 * Validate profile update details
 */
const updateProfile = (req, res, next) => {
  const updateProfileSchema = Joi.object({
    firstName: Joi.string().min(2).max(20),
    lastName: Joi.string().min(2).max(20),
    title: Joi.string().valid(...titles),
    email: Joi.string().email().messages({
      "string.email": "Email is invalid.",
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required.",
    });

  const { error } = updateProfileSchema.validate(req.body);

  if (error) {
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      message: error.message,
      error: error.details,
    });
  }

  return next();
};

/**
 * Validates institute user create details
 */
const createInstituteUser = (req, res, next) => {
  const createInstituteUserSchema = Joi.object({
    firstName: Joi.string().required().min(2).max(20),
    lastName: Joi.string().required().min(2).max(20),
    title: Joi.string()
      .valid(...titles)
      .required(),
    email: Joi.string().email().required().messages({
      "string.email": "Email is invalid.",
    }),
    role: Joi.string().valid("institute-admin", "teacher").required(),
  });

  const { error } = createInstituteUserSchema.validate(req.body);

  if (error)
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      message: error.message,
      error: error.details,
    });

  return next();
};

/**
 * Validates institute user update details
 */
const updateInstituteUser = (req, res, next) => {
  const updateInstituteUserSchema = Joi.object({
    firstName: Joi.string().min(2).max(20),
    lastName: Joi.string().min(2).max(20),
    title: Joi.string().valid(...titles),
    email: Joi.string().email(),
    role: Joi.string().valid("institute-admin", "teacher"),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required.",
    });

  const { error } = updateInstituteUserSchema.validate(req.body);

  if (error) {
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      message: error.message,
      error: error.details,
    });
  }

  return next();
};

module.exports = {
  createUser,
  email,
  password,
  login,
  updateUser,
  register,
  updateProfile,
  createInstituteUser,
  updateInstituteUser,
};
