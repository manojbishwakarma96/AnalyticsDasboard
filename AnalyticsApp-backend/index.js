const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const analyticsRoutes = require("./routes/analyticsRoutes");
const connectDB = require("./database/database");
require("dotenv").config();
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json()); // Parse JSON request bodies

connectDB();
//Use analytics route
app.use("/", analyticsRoutes);

//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
