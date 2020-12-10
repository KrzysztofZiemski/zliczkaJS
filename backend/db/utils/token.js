const jwt = require('jsonwebtoken');
const config = require('../../config.json');

const generateToken = (user) => {
    return jwt.sign({
        mail: user.email,
        sub: user.id,
        type: 'ACCESS_TOKEN'
    },
        config.TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24 * 7
    });

};

const validateToken = (req, res, next) => {
    const AUTHORIZATION_TOKEN = req.headers.authorization && req.headers.authorization.split(' ');
    if (AUTHORIZATION_TOKEN === null || AUTHORIZATION_TOKEN === undefined) return res.status(401).json('not authorized');
    if (AUTHORIZATION_TOKEN[0] !== 'Bearer') return res.status(401)

    jwt.verify(AUTHORIZATION_TOKEN[1], config.TOKEN_SECRET, (err, decoded) => {
        if (decoded) {
            req.token = decoded;
            next()
        } else {
            return res.status(401);
        }
    })
};


module.exports = { generateToken, validateToken }