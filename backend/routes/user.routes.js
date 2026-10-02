const express = require("express");

// Import controller functions
const {
    createUser,
    getUsers,
    deleteUser,
    updateUser,
    loginUser,
    logoutUser,
} = require("../controllers/user.controller.js");
const router = express.Router();

// Get all users
router.get("/", getUsers);

// Register user
router.post("/register", createUser);

// Login user
router.post("/login", loginUser);

// Delete user
router.delete("/delete/:id", deleteUser);

// Update user
router.put("/update/:id", updateUser);

// Current logged-in user
router.get("/currentUser", async (req, res) => {
    const token = req.cookies.uid;

    const { getUser } = require("../utils/auth.js");
    const User = require("../models/user.model.js");

    const user = getUser(token);

    if (!user) {
        return res.status(401).send({
            error: "Unauthorized",
        });
    }

    const data = await User.findById(user._doc._id);

    if (!data) {
        res.clearCookie("uid");

        return res.status(401).json({
            message: "User not found!, please login again",
        });
    }

    res.json(data);
});

// Search users by username
router.get("/search", async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.json([]);
        }

        const User = require("../models/user.model.js");

        const users = await User.find({
            username: {
                $regex: query,
                $options: "i",
            },
        })
            .limit(10)
            .select("_id username profilePicture");

        res.json(users);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Server error",
        });
    }
});

// Get user by ID
router.get("/getuserbyid/:id", async (req, res) => {
    const User = require("../models/user.model.js");

    const uid = req.params.id;

    const user = await User.find({
        _id: uid,
    });

    res.json(user[0]);
});

// Get user ID by username
router.get("/getid/:username", async (req, res) => {
    const User = require("../models/user.model.js");

    const username = req.params.username;

    const user = await User.find({
        username,
    });

    console.log(user[0]._id);

    res.json({
        uid: user[0]._id,
    });
});

// Logout
router.post("/logout", logoutUser);

module.exports = router;
