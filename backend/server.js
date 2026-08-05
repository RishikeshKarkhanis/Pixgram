const express = require('express'); // Importing the Express framework
const cors = require('cors'); // Importing the CORS middleware
const cookieParser = require('cookie-parser'); // Importing the cookie-parser middleware

// Importing user routes and other resource routes
const userRoutes = require('./routes/user.routes.js');
const postRoutes = require('./routes/post.routes.js');
const likeRoutes = require('./routes/like.routes.js');
const commentRoutes = require('./routes/comments.routes.js');
const followRoutes = require('./routes/follow.routes.js');

// Importing database connection and authentication middleware
const connectDatabase = require('./services/databaseConnection.js');
const restrictAccess = require('./middlewares/auth.middleware.js')

// Initializing the Express application
const app = express()
const port = 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuring CORS to allow requests from the frontend application
app.use(cors({
  origin: 'http://localhost:5173'   // Frontend URL
}));

// Setting up routes for different resources
app.use('/users', userRoutes);
app.use('/posts', restrictAccess, postRoutes);
app.use('/likes', restrictAccess, likeRoutes);
app.use('/comments', restrictAccess, commentRoutes);
app.use('/follows', restrictAccess, followRoutes);
app.use('/notifications', restrictAccess, require('./routes/notifications.routes.js'));

connectDatabase(); // Establishing database connection

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`\nApplication Running On : 'http://localhost:${port}'\n`)
})