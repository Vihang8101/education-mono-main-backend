const { Router } = require("express");
const { ObjectId } = require("mongoose").Types;
const { authorization } = require("../../middleware/authorization");
const { Class } = require("../../models/class.model");
const { Institute } = require("../../models/institute.model");
const { User } = require("../../models/user.model");

const dashboardRouter = Router();

dashboardRouter.use(authorization("institute-admin", "teacher"));

dashboardRouter.get("/", async (req, res, next) => {
  const { user } = res.locals;
  const userQuery = {};
  const classQuery = {};

  if (user.role !== "super-admin") {
    userQuery.institute = new ObjectId(user.institute);
    classQuery.institute = new ObjectId(user.institute);
  }

  try {
    let users;
    if (user.role !== "teacher")
      users = await User.aggregate()
        .match(userQuery)
        .facet({
          total: [{ $count: "count" }],
          active: [
            { $match: { approved: true, verified: true } },
            { $count: "count" },
          ],
          "pending-verification": [
            { $match: { verified: false } },
            { $count: "count" },
          ],
          "pending-approval": [
            { $match: { approved: false, verified: true } },
            { $count: "count" },
          ],
          "super-admin": [
            { $match: { role: "super-admin" } },
            { $count: "count" },
          ],
          "institute-admin": [
            { $match: { role: "institute-admin" } },
            { $count: "count" },
          ],
          teacher: [{ $match: { role: "teacher" } }, { $count: "count" }],
        });

    let institutes;
    if (user.role === "super-admin") {
      institutes = await Institute.aggregate().facet({
        total: [{ $count: "count" }],
      });
    }

    const classes = await Class.aggregate()
      .match(classQuery)
      .facet({
        total: [{ $count: "count" }],
      });
    return res.send({ users, institutes, classes });
  } catch (error) {
    return next({ error });
  }
});

module.exports = dashboardRouter;
