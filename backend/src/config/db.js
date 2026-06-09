const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("Database Connected Succesfully");
    });
  } catch (error) {
    console.log("Error while DataBase Connection");
  }
}


module.exports = connectDB;