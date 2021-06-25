const express = require("express");
const mongoose = require("mongoose");
const loggerMiddleWare = require("morgan");

const cors = require("cors");

const dbConfig = require("./config/constants.js");
const { PORT } = require("./config/constants");

const authRouter = require("./routers/auth");
const sideRouter = require("./routers/sidekicks");

// Connect to MongoDB database
mongoose
  .connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("conected to DB");
    const app = express();

    app.use(loggerMiddleWare("dev"));

    app.use(cors());

    // parse requests of content-type - application/json
    app.use(express.json());

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    if (process.env.DELAY) {
      app.use((req, res, next) => {
        setTimeout(() => next(), parseInt(process.env.DELAY));
      });
    }

    // simple route
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to my application." });
    });

    // set port, listen for requests

    app.use("/", authRouter);
    app.use("/sidekick", sideRouter);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  });
