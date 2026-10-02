const { Types: { ObjectId } } = require("mongoose");

const userService = require("../services/user.service.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await userService.getUsers();
    return res.status(200).json(users);
});

// Create user
const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);

    return res.status(201).json(user);
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const result = await userService.loginUser(req.body);

    if (!result) {
        return res.status(401).json({
            error: "Invalid credentials",
        });
    }

    res.cookie("uid", result.token);
    return res.status(200).json(result.user);
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "Invalid user ID",
        });
    }

    const result = await userService.deleteUser(id);

    if (!result) {
        return res.status(404).json({
            error: "User not found",
        });
    }

    return res.status(200).json({
        message: "User deleted successfully",
    });
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "Invalid user ID",
        });
    }

    const user = await userService.updateUser(id, req.body);

    if (!user) {
        return res.status(404).json({
            error: "User not found",
        });
    }

    return res.status(200).json(user);
});

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("uid");

    return res.status(200).json({
        message: "Logged out successfully"
    });
});

module.exports = { getUsers, createUser, loginUser, deleteUser, updateUser, logoutUser };
