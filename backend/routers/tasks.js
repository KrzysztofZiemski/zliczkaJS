
const express = require('express');
const path = require('path');
const { PERMISSION } = require('../consts');
const checkPermission = require('../middlewares/authMiddleware')
const TaskController = require('../constrollers/taskController');

const validateTask = (task) => {
    let isOk = true;
    if (typeof task.name !== 'string' || task.name.length < 3) isOk = false;
    if (typeof task.group !== 'string' || task.name.length < 2) isOk = false;
    if (typeof task.parametrized !== 'boolean') isOk = false;
    if (task.parametrized === true && (typeof task.intensityTime !== 'number' || task.intensityTime < 1)) isOk = false;
    return isOk;
}

class TasksRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /api/tasks
    routes() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.get.bind(this));
        this.router.put('/:id', checkPermission(PERMISSION.ADMIN), this.change.bind(this));
        this.router.post('/', checkPermission(PERMISSION.ADMIN), this.add.bind(this));
    }

    async getAll(req, res) {
        const active = req.query.active;
        try {
            let tasks;
            if (active === 'true') tasks = await new TaskController().getActive()
            if (active !== 'true') tasks = await new TaskController().getAll()

            res.status(200).json(tasks)
        } catch (err) {
            res.status(err.status || 500).json(err)
        }

    }
    async change(req, res) {
        try {
            const task = req.body;
            const isOk = validateTask(task)
            if (!isOk) return res.status(400).send('błędne zapytanie');
            const response = await new TaskController().changeTask(task);
            res.status(200).json(response);
        } catch (err) {
            res.status(err.status || 500).json(err)
        }

    }

    async add(req, res) {
        try {
            const task = req.body;
            const isOk = validateTask(task)
            if (!isOk) return res.status(400).send('błędne zapytanie');
            const response = await new TaskController().addTask(task);
            res.status(200).json(response);

        } catch (err) {
            res.status(err.status || 500).json(err)
        }

    }
    get(req, res) {
        const id = req.params.id;

    }
}

module.exports = TasksRouter;