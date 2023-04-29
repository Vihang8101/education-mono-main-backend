/* eslint-disable no-console */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const HTTP_STATUS = require("./utils/statusCodes");
const router = require("./routes");
// const cookieParser = require('cookie-parser');

const app = express();
// const { PORT, MONGO_URI = process.env || ;
const MONGO_URI = "mongodb://127.0.0.1:27017/education-backend";
const PORT = 3000
// Server configs
app.disable("x-powered-by");

// app.use(cookieParser('MY SECRET'));

// Simulate slow connection
const WAIT_TIME = 0;
app.use((req, res, next) => {
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, WAIT_TIME);
  }).then(() => next());
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(morgan("dev"));

// Routes
app.use("/", router);

// 404 handler
app.use((req, res, _next) => {
  res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Route not found." });
});

// Error handler
app.use((err, req, res, _next) => {
  const { status, message } = err;
  console.log({ message, ...err });
  res
    .status(status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .send({ message, ...err });
});

// Suppress deprecation warning
mongoose.set("strictQuery", false);

// Mongoose event handlers
const conn = mongoose.connection;
conn.on("connecting", () => {
  console.log("Connecting to DB...");
});
conn.on("connected", () => {
  console.log("Connected to DB.");
});
conn.on("error", (e) => {
  console.error(e);
});
// Connect to db
mongoose.connect(MONGO_URI);

// Start express server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
