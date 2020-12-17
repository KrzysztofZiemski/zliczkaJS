const bcrypt = require('bcryptjs');
const TaskModel = require('../db/taskDB')

class TaskController {

    constructor() {
        this.taskModel = new TaskModel();
    }

    async addTask(task) {

        try {
            return this.taskModel.inserTask(task);
        } catch (err) {
            const error = new Error('błąd przy dodawaniu zadanie');
            error.status = 500;
            throw error;
        }

    }

}


module.exports = TaskController;