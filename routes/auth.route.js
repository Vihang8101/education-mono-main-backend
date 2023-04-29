const authRouter = require("express").Router();
const tokenController = require("../controllers/token.controller");
const userSchema = require("../controllers/user.schema");
const userController = require("../controllers/user.controller");
const authentication = require("../middleware/authentication");

// Path: /auth

// Verify token
authRouter.get("/token/check", tokenController.verifyToken, (req, res) =>
  res.send()
);

// Regenerate new token
authRouter.get(
  "/token/regenerate",
  tokenController.regenerateToken,
  (req, res) => res.send()
);

// Create user password if token is valid
authRouter.put(
  "/set-password",
  tokenController.verifyToken,
  userSchema.password,
  userController.createPassword
);

// Registration
authRouter.post(
  "/register",
  userSchema.register,
  userController.register,
  tokenController.generateToken
);

// Login
authRouter.post(
  "/login",
  userSchema.login,
  userController.login,
  userController.getAccessToken
);

// Reset password
authRouter.post(
  "/reset-password",
  userSchema.email,
  userController.generatePasswordResetToken
);

// Protected routes
authRouter.use(authentication);

// Login activity
authRouter.get("/login-activity", userController.getLoginActivity);

// Logout all
authRouter.delete("/logout", userController.logout);

// Logout (delete jti)
authRouter.delete("/logout", userController.logout);

// Update profile
authRouter.put(
  "/profile",
  userSchema.updateProfile,
  (req, res, next) => {
    req.params.userId = res.locals.user.sub;
    next();
  },
  userController.updateUserById
);

module.exports = authRouter;
