const express = require('express'); // Import Express framework

// Import controller functions for user operations
const { createUser,getUsers,deleteUser, updateUser, loginUser } = require('../controllers/user.controller.js');
const { getUser } = require('../services/auth.js');

// Import User and Post models
const User = require('../models/user.model.js');
const Post = require("../models/post.model.js");

const router = express.Router(); // Create a router instance

// Route to get the current logged-in user's information
router.get('/currentUser', async (req, res) => {
    const token = req.cookies.uid; // Getting the token from cookies

    const user = getUser(token); // Retrieve user based on token
    
    if (!user) { return res.status(401).send({ "error": "Unauthorized" });}
    const data = await User.findById(user._doc._id);

    if(!data) {
        res.clearCookie("uid");
        return res.status(401).json({ message: "User not found!, please login again" });
    }

    res.json(data);
});

// Route to search for users by username
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) return res.json([]);

    const users = await User.find({
      username: { $regex: query, $options: "i" } // "i" = case-insensitive
    })
      .limit(10) // only top 10 results
      .select("_id username profilePicture"); // send only needed fields

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get user by ID
router.get('/getuserbyid/:id', async (req, res) => {
    const uid = req.params.id;
    const user = await User.find({_id:uid});
    res.json(user[0]);
});

// Route to get user ID by username
router.get('/getid/:username', async (req, res) => {
    const username = req.params.username;
    const user = await User.find({username});
    console.log(user[0]._id);
    
    res.json({"uid":user[0]._id});
});

// Route to get posts by user ID
router.post('/register', async (req, res) => {
    const userData = req.body;
    const user = await createUser(userData);
    if (user === null) {
        return res.status(400).send({ "error": "User creation failed" });

    } else {
        res.status(201).send(user);
    }
});

// Route for user login
router.post('/login', async (req, res) => {

    const user = await loginUser(req, res);

    if (user === null) {
        return res.status(401).send("Login failed: Invalid credentials");
    }

    res.send(`Login successful for user: ${user}`);

});

// Route to delete a user by ID
router.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    const result = deleteUser(userId);
    res.json(result);
});

// Route to update user information by ID
router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    const out = await updateUser(userId, userData);
    res.json(out);
});

// Route for user logout
router.post('/logout', async (req, res) => {
    res.clearCookie("uid");
    res.status(200).json({ message: "Logged out successfully" });
    console.log("user logged out!");
    
});

// Default route to get list of users
router.get('/', (req, res) => {
    getUsers();
    res.send("The List Of Users");
});

// Export the router to be used in the main app
module.exports = router;