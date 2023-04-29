const { Router } = require("express");
const {
  Types: { ObjectId },
} = require("mongoose");
const classSchema = require("../../controllers/class.schema");
const classController = require("../../controllers/class.controller");
const instituteService = require("../../services/institute.service");
const { authClass, authorization } = require("../../middleware/authorization");

// Path: /admin/classes/
const classesRouter = Router();

classesRouter.use(authorization("institute-admin", "teacher"));

// Get all classes
classesRouter.get(
  "/",
  async (req, res, next) => {
    const { user } = res.locals;
    if (user.role === "super-admin") return next();
    const institute = await instituteService.getById(user.institute);

    req.query = {
      ...req.query,
      query: {
        ...req.query.query,
        institute: [
          { _id: new ObjectId(user.institute), name: institute.name },
        ],
      },
    };
    return next();
  },
  classController.getClasses
);

// Create new class
classesRouter.post("/", classSchema.createClass, classController.createClass);

// Get a single class by id
classesRouter.get("/:classId", authClass, classController.getClassById);

// Update a class
classesRouter.put(
  "/:classId",
  authClass,
  classSchema.updateClass,
  classController.updateClass
);

// Delete class by id
classesRouter.delete("/:classId", authClass, classController.deleteClassById);

module.exports = classesRouter;
