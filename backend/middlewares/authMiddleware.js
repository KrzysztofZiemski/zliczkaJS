const consts = require('../consts');
const jwt = require('../utility/jwt');

const checkPermission = (requiredPermission = 0) => {
    return async function checkPermission(req, res, next) {
        try {
            const tokenCoded = req.cookies.token;
            const token = jwt.checkHash(tokenCoded)
            req.token = token;
            if (requiredPermission > token.permission) {
                return res.status(401).redirect('/login')
            }
            next()
        } catch (err) {
            return res.status(401).redirect('/login')
        }

    }
}

module.exports = checkPermission;