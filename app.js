const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const urlRouter = require('./routes/urlRoute');


const app =express();
// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth/', userRoute);
app.use('/api/url/', urlRouter);

module.exports = app;