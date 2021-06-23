const dbConfig = require("../config/constants.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require("./user.js")(mongoose);

//  db.sidekicks.users.createIndex({ email: 1 }, { unique: true });

module.exports = db;
