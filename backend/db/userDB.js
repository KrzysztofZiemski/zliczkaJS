const bcrypt = require('bcryptjs');
const User = require('./models/userSchema');
const { PERMISSION } = require('../consts');

class UserDB {

    constructor() { }

    inserUser({ name, active, login, lastName, password, permission }) {

        const userData = new User({
            name,
            active,
            login,
            lastName,
            password,
            permission

        })
        return userData.save((err) => {
            console.log('weszło', err)
        })
    }
}


module.exports = UserDB;