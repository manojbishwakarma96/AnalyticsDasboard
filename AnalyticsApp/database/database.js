const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://manojbishwakarma88:manoj123@analytics.jf80u9m.mongodb.net/analyticsDB"
    );
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;
