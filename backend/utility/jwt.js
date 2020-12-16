const { hash } = require("bcryptjs");
const jwt = require('jsonwebtoken');

const createHash = (data) => {
    return jwt.sign(data,
        process.env.SECRET_TOKEN, {
        expiresIn: "10h"
    });
};
const checkHash = (token) => {
    return jwt.verify(token, process.env.SECRET_TOKEN);
}


module.exports = { checkHash, createHash };