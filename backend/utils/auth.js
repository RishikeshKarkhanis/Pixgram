const jwt = require("jsonwebtoken");

const secret = "rk250306";

function setUser(user) {
    const payload = {
        userId: user._id.toString(),
    };

    return jwt.sign(payload, secret, {
        expiresIn: "7d",
    });
}

function getUser(token) {
    if (!token) {
        return null;
    }

    return jwt.verify(token, secret);
}

module.exports = {
    setUser,
    getUser,
};