const express = require('express');
const mongoose = require('mongoose');
const analyticsRoutes = require('./routes/analyticsRoutes');
const connectDB = require('./database/database');
const app = express();

connectDB();
//Use analytics route
app.use('/',analyticsRoutes);

//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})