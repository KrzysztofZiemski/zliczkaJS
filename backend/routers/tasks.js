
const express = require('express');
const path = require('path');

const fakeResponse = [
    {
        id: 1,
        name: 'Zarchiwizowane dokumenty',
        type: 'dokumenty',
        isParameterized: true,
        lastActive: new Date(),
        active: true,
        intensityTime: 120, //in seconds?
    },
    {
        id: 2,
        name: 'Przygotowanie dokumentów do wypożyczenia',
        type: 'dokumenty',
        isParameterized: true,
        lastActive: new Date(),
        active: true,
        intensityTime: 120,
    },
    {
        id: 3,
        type: 'Apex',
        name: 'Weryfikacja wysyłki',
        isParameterized: false,
        lastActive: new Date(),
        active: true,
        intensityTime: 120,
    },
    {
        id: 4,
        name: 'Zatwierdzanie wypożyczeń',
        type: 'Indo',
        isParameterized: true,
        lastActive: new Date(),
        active: true,
        intensityTime: 120,
    },
    {
        id: 5,
        name: 'Wysyłka kart',
        type: 'karty',
        isParameterized: true,
        lastActive: new Date(),
        active: true,
        intensityTime: 120,
    },
    {
        id: 6,
        name: 'Niszczenie kart',
        type: 'karty',
        isParameterized: true,
        lastActive: new Date(),
        active: true,
        intensityTime: 120,
    },
    {
        id: 7,
        name: 'dfgr',
        type: 'Apex',
        isParameterized: false,
        lastActive: new Date(),
        active: true,
        intensityTime: 120,
    }
]

class TasksRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /api/tasks
    routes() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.get.bind(this));
    }

    getAll = (req, res) => {
        res.status(200).json(fakeResponse)
    }

    get(req, res) {
        const id = req.params.id;

    }
    // async add(req, res) {
    //     const data = req.body;

    // }
}

module.exports = TasksRouter;