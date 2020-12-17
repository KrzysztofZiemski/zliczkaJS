const User = require('./models/userSchema');

class UserModel {

    constructor() {

    }
    update(id, filters) {
        return User.findOneAndUpdate({ _id: id }, filters);
    }
    async removeUser(id) {
        return User.findOneAndUpdate({ _id: id }, { active: false });
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