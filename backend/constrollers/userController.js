const bcrypt = require('bcryptjs');
const UserDB = require('../db/userDB')
const { PERMISSION } = require('../consts');
class UserController {

    constructor() {
        this.userModel = new UserDB();
    }

    addUser(user) {
        user.permission = PERMISSION.USER
        user.password = bcrypt.hashSync(user.password, Number(process.env.HASH_ROUND))
        user.active = true;
        return this.userModel.inserUser(user);
    }
    async getEmployees() {
        const employees = await this.userModel.getBy({ permission: PERMISSION.USER })
        const output = employees.map(({ _doc, ...el }) => {
            const { password, _id, __v, ...other } = _doc;
            return { id: _id, ...other };
        })
        return output;
    }
}


module.exports = UserController;