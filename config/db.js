const mongoose = require("mongoose");
require("dotenv").config();


const connectionToDB = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected To DB"))
    .catch((error) => console.log("Connection To DB", error));
}


module.exports = connectionToDB;