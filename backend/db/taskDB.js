const Task = require('./models/taskSchema');

class TaskModel {

    constructor() {

    }
    // update(id, filters) {
    //     return User.findOneAndUpdate({ _id: id }, filters);
    // }
    // async removeUser(id) {
    //     return User.findOneAndUpdate({ _id: id }, { active: false });
    // }

    inserTask(task) {
        return new Task(task).save();
    }
    // getAll() {
    //     return User.find()
    // }
    // getBy(filters) {
    //     return User.find(filters)
    // }
}


module.exports = TaskModel;