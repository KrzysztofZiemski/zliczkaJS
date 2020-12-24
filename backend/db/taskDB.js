const Task = require('./models/taskSchema');

class TaskModel {

    constructor() {

    }

    update(id, filters) {
        const { group, active, intensityTime, name, parametrized } = filters;
        return Task.findOneAndUpdate({ _id: id }, { group, active, intensityTime, name, parametrized });
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