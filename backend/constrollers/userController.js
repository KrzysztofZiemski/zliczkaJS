const bcrypt = require('bcryptjs');
const UserDB = require('../db/userDB')
const { PERMISSION } = require('../consts');
class UserController {

    constructor() { }

    addUser({ name, active, login, lastName, password, permission }) {

        //weryfikacja czy już istnieje taki user?
        //weryfikacja czy dany perrmision może być nadany przez użytkownika

        new UserDB().inserUser()
        const userData = new User({
            name: 'admin',
            active: true,
            login: 'admin',
            lastName: 'adminLast',
            password: bcrypt.hashSync(password, Number(process.env.HASH_ROUND)),
            permission: permission || PERMISSION.USER
        })
    }
}


module.exports = UserController;