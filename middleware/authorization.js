const classService = require("../services/class.service");
const userService = require("../services/user.service");
const HTTP_STATUS = require("../utils/statusCodes");

/**
 * Determines whether user has access to requested resource
 * @param  {...any} roles
 */
const authorization =
  (...roles) =>
  (req, res, next) => {
    const { user } = res.locals;

    if (user.role === "super-admin") return next();

    if (roles.includes(user.role)) {
      req.body.institute = user.institute;
      return next();
    }

    return next({
      status: HTTP_STATUS.FORBIDDEN,
      message: "Unauthorized.",
    });
  };

/**
 * Determines if user can access requested institute
 */
const authInstitute = (req, res, next) => {
  const { user } = res.locals;
  if (user.role === "super-admin") return next();

  const { instituteId } = req.params;
  if (user.institute === instituteId) return next();

  return next({
    status: HTTP_STATUS.FORBIDDEN,
    message: "Unauthorized.",
  });
};

/**
 * Determines if user can access requested class
 */
const authClass = async (req, res, next) => {
  const { user } = res.locals;
  if (user.role === "super-admin") return next();

  try {
    const { classId } = req.params;

    const classDoc = await classService.getById(classId);

    if (!classDoc)
      return next({
        status: HTTP_STATUS.NOT_FOUND,
        message: "Class does not exist.",
      });

    if (classDoc.institute.toString() === user.institute) return next();

    return next({
      status: HTTP_STATUS.FORBIDDEN,
      message: "Unauthorized.",
    });
  } catch (error) {
    return next({ error });
  }
};

/**
 * Determines if user can access requested user account
 */
const authUsers = async (req, res, next) => {
  const { user } = res.locals;
  if (user.role === "super-admin") return next();

  try {
    const { userId } = req.params;

    const requestedUser = await userService.getById(userId);
    if (!requestedUser)
      return next({
        status: HTTP_STATUS.NOT_FOUND,
        message: "User does not exist.",
      });

    if (requestedUser.institute.toString() === user.institute) return next();

    return next({
      status: HTTP_STATUS.FORBIDDEN,
      message: "Unauthorized.",
    });
  } catch (error) {
    return next({ error });
  }
};

module.exports = { authorization, authInstitute, authClass, authUsers };
