
const express = require('express');
const path = require('path');

const fakeResponse =
{
    idReport: 111,
    userId: 321,
    description: 'jakiś opis',
    date: new Date(),
    tasks: [
        {
            id: 1,
            name: 'Zarchiwizowane dokumenty',
            isParameterized: true,
            count: 3,
        },
        {
            id: 2,
            name: 'Przygotowanie dokumentów do wypożyczenia',
            isParameterized: true,
            count: 31,
        },
        {
            id: 3,
            name: 'Weryfikacja wysyłki',
            isParameterized: false,
            count: 31,
            time: 123
        },
    ]
}

class ReportsRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /api/reports
    routes() {
        // this.router.get('/', this.getAll);
        this.router.get('/:date', this.get.bind(this));
        this.router.post('/', this.add.bind(this));
        this.router.put('/:idReport', this.update.bind(this));
    }

    getAll = (req, res) => {
        res.status(200).json(fakeResponse)

    }

    get(req, res) {
        const date = req.params.date //format in milisecunds
        //todo if no report yet, create new
        res.status(200).json(fakeResponse)


    }

    update(req, res) {
        const date = req.params.idReport;
        console.log('update', date, req.body);
        res.status(200).send('ok')
    }

    add(req, res) {
        console.log(req.body);
    }
    // async add(req, res) {
    //     const data = req.body;

    // }
}

module.exports = ReportsRouter;