const { getUser } = require("../utils/auth.js");
const User = require("../models/user.model.js");

const restrictAccess = async (req, res, next) => {
    const token = req.cookies.uid;

    if (!token) {
        return res.status(401).json({
            error: "Unauthorized: No valid user session found",
        });
    }

    try {
        const payload = getUser(token);

        if (!payload?.userId) {
            return res.status(401).json({
                error: "Unauthorized: Invalid user session",
            });
        }

        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(401).json({
                error: "Unauthorized: User no longer exists",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            error: "Unauthorized: Invalid or expired user session",
        });
    }
};

module.exports = restrictAccess;