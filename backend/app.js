const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoutes = require('./routes/user');
const postsRoutes = require('./routes/posts');
const threadRoutes = require('./routes/thread');

// Creating express server
const app = express();

// for environment variable access
dotenv.config();

// Database Connection
mongoose.connect(
    "mongodb+srv://tmp:" + 
    process.env.MONGO_ATLAS_PW + 
    "@cluster0-roift.mongodb.net/message-api?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection to database failed');
    }
);

// Node.js body parsing middleware - allows use of req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// access to images - and storage of images location
app.use("/images", express.static(path.join("backend/images")));

// For CORS Authentication
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

// Routes that start with /api/posts
app.use("/api/posts", postsRoutes);

// Routes that start with /api/user
app.use("/api/user", userRoutes);

// Routes that start with /api/thread
app.use("/api/thread", threadRoutes);

module.exports = app;
