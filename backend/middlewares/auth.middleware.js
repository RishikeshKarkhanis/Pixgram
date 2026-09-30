const { getUser } = require('../utils/auth.js');

const restrictAccess = (req, res, next) => {
    const uid = req.cookies.uid;

    if (!uid) {
        return res.status(401).json({
            error: 'Unauthorized: No valid user session found'
        });
    }

    const user = getUser(uid);

    if (!user) {
        return res.status(401).json({
            error: 'Unauthorized: No valid user session found'
        });
    }

    req.user = user;

    next();
};

module.exports = restrictAccess;