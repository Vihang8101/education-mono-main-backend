const router = require("express").Router();

const baseRouter = require("./base.route");
const authRouter = require("./auth.route");
const adminRouter = require("./admin");

router.use("/", baseRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);

module.exports = router;
