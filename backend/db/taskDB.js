const Task = require('./models/taskSchema');

class TaskModel {

    constructor() {

    }

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
    getBy(filters) {
        return Task.find(filters)
    }
}


module.exports = TaskModel;