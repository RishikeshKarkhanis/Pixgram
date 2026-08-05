const {getUser} = require('../services/auth.js');

function restrictAccess(req, res, next) {
    const uid = req.cookies.uid;
    const user = getUser(uid);

    if (!user) {
        return res.status(401).send("Unauthorized: No valid user session found");
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
}

module.exports = restrictAccess;