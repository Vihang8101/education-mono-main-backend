const { Router } = require("express");
const instituteController = require("../controllers/institute.controller");
const enums = require("../utils/enums");

const baseRouter = Router();

baseRouter
  .get("/institutes", instituteController.getInstituteList)
  .get("/institutes/:instituteId", instituteController.getInstituteById)
  .get("/search-institutes", instituteController.searchInstitutes)
  .get("/roles", (req, res) => res.send(enums.roles))
  .get("/titles", (req, res) => res.send(enums.titles))
  .get("/levels", (req, res) => res.send(enums.instituteLevels))
  .get("/types", (req, res) => res.send(enums.instituteTypes))
  .get("/territories", (req, res) => res.send(enums.territories))
  .get("/key-stages", (req, res) => res.send(enums.keyStages))
  .get("/exam-boards", (req, res) => res.send(enums.examBoards));

module.exports = baseRouter;
