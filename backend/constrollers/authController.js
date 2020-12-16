const UserController = require('./userController');
const bcrypt = require('bcryptjs');
const hash = require('../utility/jwt');

class AuthController {
    constructor() {

    }

    async checkPassword(inputPassword, userPassword) {
        return bcrypt.compare(inputPassword, userPassword)
    }

    auth(checkingLogin, checkingPassword) {

        const userApi = new UserController();

        return userApi.get({ login: checkingLogin })
            .then(async ([user]) => {

                if (user) {
                    const isOk = await this.checkPassword(checkingPassword, user.password);
                    const isActive = user.active;

                    if (!isOk || !isActive) {
                        const error = new Error('błędny login lub hasło')
                        error.status = 401
                        throw error;
                    }

                    const { name, lastName, _id, permission, ...other } = user
                    return { token: hash.createHash({ name, lastName, id: _id, permission }), permission: permission }
                } else {
                    const error = new Error('nie znaleziono użytkownika')
                    error.status = 401;
                    throw error
                }
            })
    }
}


module.exports = AuthController;