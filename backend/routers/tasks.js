
const express = require('express');
const path = require('path');
const { PERMISSION } = require('../consts');
const checkPermission = require('../middlewares/authMiddleware')
const TaskController = require('../constrollers/taskController');


// const fakeResponse = [
//     {
//         id: 1,
//         name: 'Zarchiwizowane dokumenty',
//         type: 'dokumenty',
//         isParameterized: true,
//         lastActive: new Date(),
//         active: true,
//         intensityTime: 120, //in seconds?
//     },
//     {
//         id: 2,
//         name: 'Przygotowanie dokumentów do wypożyczenia',
//         type: 'dokumenty',
//         isParameterized: true,
//         lastActive: new Date(),
//         active: true,
//         intensityTime: 120,
//     },
//     {
//         id: 3,
//         type: 'Apex',
//         name: 'Weryfikacja wysyłki',
//         isParameterized: false,
//         lastActive: new Date(),
//         active: true,
//         intensityTime: 120,
//     },
//     {
//         id: 4,
//         name: 'Zatwierdzanie wypożyczeń',
//         type: 'Indo',
//         isParameterized: true,
//         lastActive: new Date(),
//         active: true,
//         intensityTime: 120,
//     },
//     {
//         id: 5,
//         name: 'Wysyłka kart',
//         type: 'karty',
//         isParameterized: true,
//         lastActive: new Date(),
//         active: true,
//         intensityTime: 120,
//     },
//     {
//         id: 6,
//         name: 'Niszczenie kart',
//         type: 'karty',
//         isParameterized: true,
//         lastActive: new Date(),
//         active: true,
//         intensityTime: 120,
//     },
//     {
//         id: 7,
//         name: 'dfgr',
//         type: 'Apex',
//         isParameterized: false,
//         lastActive: new Date(),
//         active: true,
//         intensityTime: 120,
//     }
// ]

const validateTask = (task) => {
    let isOk = true;
    if (typeof task.name !== 'string' || task.name.length < 3) isOk = false;
    if (typeof task.group !== 'string' || task.name.length < 2) isOk = false;
    if (typeof task.parameterized !== 'boolean') isOk = false;
    if (task.parameterized === true && (typeof task.intensityTime !== 'number' || task.intensityTime < 1)) isOk = false;
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
        try {
            const tasks = await new TaskController().getAll()
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