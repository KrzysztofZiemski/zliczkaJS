const bcrypt = require('bcryptjs');
const UserDB = require('../db/userDB')
const { PERMISSION } = require('../consts');
class UserController {

    constructor() {
        this.userModel = new UserDB();
    }
    async activate(id) {
        return this.userModel.update(id, { active: true })
    }
    async addUser(user) {
        user.permission = PERMISSION.USER;
        user.password = await bcrypt.hash(user.password, Number(process.env.HASH_ROUND));
        user.active = true;
        return this.userModel.inserUser(user);
    }
    removeEmployee(id) {
        return this.userModel.removeUser(id)
    }
    async getEmployees() {
        const employees = await this.userModel.getBy({ permission: PERMISSION.USER })
        const output = employees.map(({ _doc, ...el }) => {
            const { password, _id, __v, ...other } = _doc;
            return { id: _id, ...other };
        })
        return output;
    }
    get(filter) {
        return this.userModel.getBy(filter)
    }
}


module.exports = UserController;