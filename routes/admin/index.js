const adminRouter = require("express").Router();
const usersRouter = require("./users.route");
const institutesRouter = require("./institutes.router.");
const classesRouter = require("./classes.route");
const dashboardRouter = require("./dashboard.route");
const authentication = require("../../middleware/authentication");

// Path: /admin

adminRouter.use(authentication);

adminRouter.use("/users", usersRouter);
adminRouter.use("/classes", classesRouter);
adminRouter.use("/institutes", institutesRouter);
adminRouter.use("/dashboard", dashboardRouter);

module.exports = adminRouter;
