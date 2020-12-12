const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

checkUser = (req, res, next) => {
    if (req.cookies.user) {
        const user = req.cookies.user;
        jwt.verify(user, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (decoded) {
                req.body.verify = decoded;
                next()
            } else {
                return res.status(401).json('not access');
            }
        })
    }
    next()
}

module.exports = checkUser;