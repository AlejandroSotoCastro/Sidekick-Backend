const db = require("../models");
const User = db.user;

// Save User in the database

const createUser = async () => {
  // Create a User
  const user = new User({
    title: "title",
    description: "description",
    published: false,
  });
  const savedUser = await user
    .save(user)

    .catch((err) => {
      console.log(err.message, "Some error occurred");
    });
};

createUser();

const getUsers = () => {
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
};

//getUsers();
