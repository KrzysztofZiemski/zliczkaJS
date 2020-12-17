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
    update(id, filters) {
        const { group, active, intensityTime, name, parameterized } = filters;
        return Task.findOneAndUpdate({ _id: id }, { group, active, intensityTime, name, parameterized });
    }
    inserTask(task) {
        return new Task(task).save();
    }
    getAll() {
        return Task.find()
    }
    // getBy(filters) {
    //     return User.find(filters)
    // }
}


module.exports = TaskModel;