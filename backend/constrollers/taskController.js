const bcrypt = require('bcryptjs');
const { createIndexes } = require('../db/models/taskSchema');
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
    async getActive() {
        const tasks = await this.taskModel.getBy({ active: true })
        return tasks.map(task => {
            const { active, group, intensityTime, _id, name, parameterized, ...other } = task;
            return { active, group, intensityTime, name, parameterized, id: _id }
        })
    }
    async getAll() {
        const tasks = await this.taskModel.getAll();
        return tasks.map(task => {
            const { active, group, intensityTime, _id, name, parameterized, ...other } = task;
            return { active, group, intensityTime, name, parameterized, id: _id }
        })
    }
    async changeTask(task) {
        try {
            return this.taskModel.update(task.id, task)
        } catch (err) {
            const error = new Error('błąd przy aktualizacji zadania');
            error.status = 500;
            throw error;
        }

    }

}


module.exports = TaskController;