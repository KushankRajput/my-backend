const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Connection successful"))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
};

module.exports = dbConnect;
