const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const dbConfig = require("./config/config.js");

const authRouter = require("./routers/auth");
const sideRouter = require("./routers/sidekicks");

const PORT = process.env.PORT || 4000;

// Connect to MongoDB database
mongoose
  .connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("conected to DB");
    const app = express();

    app.use(cors());

    // parse requests of content-type - application/json
    app.use(express.json());

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

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

/*
const db = require("./models");
db.mongoose
  .connect(db.url, {
    // dbName: "sidekicks",
    // user: "admin",
    // pass: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    console.log("Connected to the database!");
    const User = db.user;
    // // Create a User
    // const user = new User({
    //   title: "title",
    //   description: "description",
    //   published: false,
    // });
    // const savedUser = await user
    //   .save(user)

    //   .catch((err) => {
    //     console.log(err.message, "Some error occurred");
    //   });
    // console.log(savedUser);
    User.find()
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log({
          message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
      });
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

  */
