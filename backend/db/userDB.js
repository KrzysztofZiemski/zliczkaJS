const bcrypt = require('bcryptjs');
const User = require('./models/userSchema');
const { PERMISSION } = require('../consts');

class UserModel {

    constructor() {

    }

    inserUser(user) {
        return new User(user).save();
    }
    getAll() {
        return User.find()
    }
    getBy(filters) {
        return User.find(filters)
    }
}


module.exports = UserModel;