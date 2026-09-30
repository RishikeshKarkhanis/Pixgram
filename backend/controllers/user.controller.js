const {
    Types: { ObjectId },
} = require("mongoose");

const userService = require("../services/user.service.js");

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);

        return res.status(500).json({
            error: "Failed to retrieve users",
        });
    }
};

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);

        return res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);

        return res.status(500).json({
            error: "Failed to create user",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const result = await userService.loginUser(req.body);

        if (!result) {
            return res.status(401).json({
                error: "Invalid credentials",
            });
        }

        res.cookie("uid", result.token);

        return res.status(200).json(result.user);
    } catch (error) {
        console.error("Error logging in user:", error);

        return res.status(500).json({
            error: "Failed to login",
        });
    }
};

const deleteUser = async (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error deleting user:", error);

        return res.status(500).json({
            error: "Failed to delete user",
        });
    }
};

const updateUser = async (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error updating user:", error);

        return res.status(500).json({
            error: "Failed to update user",
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    loginUser,
    deleteUser,
    updateUser,
};
