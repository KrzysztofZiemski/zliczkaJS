const UserController = require('./userController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    constructor() {

    }

    async checkPassword(inputPassword, userPassword) {
        return bcrypt.compare(inputPassword, userPassword)
    }

    async auth(checkingLogin, checkingPassword) {
        try {
            const userApi = new UserController();
            const [user] = await userApi.get({ login: checkingLogin });
            if (user) {
                const isOk = await this.checkPassword(checkingPassword, user.password);
                const isActive = user.active;

                if (!isOk || !isActive) return ({ status: 401 })

                const { active, login, password, created, ...toHash } = user

                const cookie = jwt.sign(toHash,
                    process.env.SECRET_TOKEN, {
                    expiresIn: "10h"
                });

                return ({ status: 200, cookie })
            } else {
                return ({ status: 401 })
            }

        } catch (err) {
            return ({ status: 500, cookie: {}, body: { err } })
        }
    }
}

module.exports = AuthController;