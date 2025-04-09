const mongoose = require("mongoose");

async function connectDb() {
  try {
    const connect = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING
    );
    console.log(
      `Database Connected ${connect.connection.host} ${connect.connection.name}`
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDb;
