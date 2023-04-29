const { Router } = require("express");
const userController = require("../../controllers/user.controller");
const userSchema = require("../../controllers/user.schema");
const tokenController = require("../../controllers/token.controller");
const { authUsers, authorization } = require("../../middleware/authorization");
const injectInstitute = require("../../middleware/injectInstitute");

// Path: /admin/users
const usersRouter = Router();
usersRouter.use(authorization("institute-admin"));

// Create new user
usersRouter.post(
  "/",
  userSchema.createUser,
  userController.createUser,
  tokenController.generateToken
);

// Get users
usersRouter.get("/", injectInstitute, userController.getUsers);

// Approve account
usersRouter.put("/approve/:userId", authUsers, userController.approveUser);

// Get user by id
usersRouter.get("/:userId", authUsers, userController.getUserById);

// Update existing user
usersRouter.put(
  "/:userId",
  authUsers,
  userSchema.updateUser,
  userController.updateUserById
);

// Delete User by id
usersRouter.delete("/:userId", authUsers, userController.deleteUserById);

module.exports = usersRouter;
