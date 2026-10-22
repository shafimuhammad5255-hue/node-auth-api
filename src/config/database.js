const mongoose = require("mongoose");
const { mongoUri } = require("./env");

async function connectDatabase() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}

module.exports = connectDatabase;
