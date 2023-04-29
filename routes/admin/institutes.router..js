const { Router } = require("express");
const {
  authorization,
  authInstitute,
} = require("../../middleware/authorization");
const instituteController = require("../../controllers/institute.controller");
const instituteSchema = require("../../controllers/institute.schema");

// Path: /institutes
const institutesRouter = Router();

// Remove institute from body
institutesRouter.use((req, res, next) => {
  delete req.body.institute;
  next();
});

// Get Institutes
institutesRouter.get("/", authorization(), instituteController.getInstitutes);

// Creates institute
institutesRouter.post(
  "/",
  authorization(),
  instituteSchema.createInstitute,
  instituteController.createInstitute
);

institutesRouter.use(authorization("institute-admin"));

// Get institute by id
institutesRouter.get(
  "/:instituteId",
  authInstitute,
  instituteController.getInstituteById
);

// Update institute by id
institutesRouter.put(
  "/:instituteId",
  authInstitute,
  instituteSchema.updateInstitute,
  instituteController.updateInstituteById
);

// Delete Institute by id
institutesRouter.delete(
  "/:instituteId",
  authInstitute,
  instituteController.deleteInstituteById
);

module.exports = institutesRouter;
