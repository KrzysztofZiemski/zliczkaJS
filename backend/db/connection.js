const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const config = require("../config.json");

const connection = () => {
  return mongoose.connect(config.DB.SERVER_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connection;
