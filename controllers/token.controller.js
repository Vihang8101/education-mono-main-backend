const sendMail = require("../utils/sendMail");
const tokenService = require("../services/token.service");
const HTTP_STATUS = require("../utils/statusCodes");

/**
 * Generates and sends token in mail
 */
const generateToken = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const verification = await tokenService.create(user._id);

    // Send email
    sendMail(user, verification.token);

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

/**
 *  Verify that token is valid
 */
const verifyToken = async (req, res, next) => {
  const { token } = req.query;

  // Check if token is provided
  if (!token)
    return next({
      status: HTTP_STATUS.UNAUTHORIZED,
      error: { message: "Invalid token." },
    });

  try {
    // Check if token exists
    const record = await tokenService.getByToken(token);
    if (!record)
      return next({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Invalid token.",
      });

    // Check if token is expired
    if (record.expiresAt.getTime() <= new Date().getTime()) {
      return next({
        status: HTTP_STATUS.FORBIDDEN,
        message: "Token expired.",
        error: { message: "Token expired." },
      });
    }

    return next();
  } catch (error) {
    return next({ error });
  }
};

/*
    Regenerate new token
  */
const regenerateToken = async (req, res, next) => {
  const { token } = req.query;
  // Check if token is provided
  if (!token)
    return next({
      status: HTTP_STATUS.BAD_REQUEST,
      error: { message: "Invalid token." },
    });

  try {
    // Check whether token exists in db
    const record = await tokenService.getByToken(token);
    if (!record) {
      return next({
        status: HTTP_STATUS.UNAUTHORIZED,
        error: { message: "Invalid token." },
      });
    }

    // Generate new token
    const newRecord = await tokenService.create(record.user);
    await newRecord.populate("user");

    // Send mail
    sendMail(newRecord.user, newRecord.token);

    return next();
  } catch (error) {
    return next({ error });
  }
};

module.exports = { verifyToken, regenerateToken, generateToken };
