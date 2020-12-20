
const express = require('express');
const path = require('path');
const ReportController = require('../constrollers/reportController');
const { PERMISSION } = require('../consts');
const { validate } = require('../db/models/userSchema');
const checkPermission = require('../middlewares/authMiddleware')


const checkFormatDate = (dateString) => {
    const regExpDate = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/
    const match = dateString.match(regExpDate)
    return match ? true : false
}
const validateTaskReport = () => {
    //     id: '5fdf3c8858979234489f2bbb',
    //     tasks: [
    //       {
    //         taskId: '5fde2f79dd278e062cce6543',
    //         name: 'archiwizacja dokumentów',
    //         count: 1,
    //         time: null,
    //         intensityTime: 2
    //       },
    //       {
    //         taskId: '5fde2f8cdd278e062cce6544',
    //         name: 'akawryjne zamawianie karty',
    //         count: 1,
    //         time: null
    //       },
    //       {
    //         taskId: '5fde2f9edd278e062cce6545',
    //         name: 'stworzenie raportu KRI',
    //         count: 1,
    //         time: null
    //       }
    //     ],
    //     confirmed: false,
    //     userId: '5fd79c9cefe56b071c466934',
    //     date: '2020-12-20T00:00:00.000Z',
    //     description: ''
    //   }
}
const validateReport = (report) => {
    const { id, tasks, userId, date, description } = report;
    let isOk = true;
    if (!id) isOk = false;
    if (!Array.isArray(tasks)) isOk = false;
    if (!userId) isOk = false;
    if (!checkFormatDate(date)) isOk = false;

    if (typeof description !== 'string') isOk = false;
    return isOk;
}
//todo cały router
class ReportsRouter {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    // /api/reports
    routes() {
        this.router.get('/create/:date', checkPermission(PERMISSION.USER), this.create.bind(this));
        this.router.get('/:date', checkPermission(PERMISSION.USER), this.getSelf.bind(this));
        this.router.post('/', checkPermission(PERMISSION.USER), this.addSelf.bind(this));
        this.router.put('/:idReport', checkPermission(PERMISSION.USER), this.updateSelf.bind(this));
    }

    getAll = (req, res) => {
        res.status(200).json(fakeResponse)
    }
    async create(req, res) {
        const dateString = req.params.date;
        const idUser = req.token.id;
        if (!dateString) return res.status(400).send('required date param');
        const isOk = checkFormatDate(dateString);

        if (!isOk) return res.status(400).send('invalid data format');
        try {
            const response = await new ReportController().createReport(idUser, dateString)
            res.status(200).json(response)
        } catch (err) {
            res.status = err.status || 500;
            res.send('błąd podczas tworzenia raportu')
        }


    }
    async getSelf(req, res) {
        try {
            const dateString = req.params.date;
            const idUser = req.token.id

            if (!dateString) return res.status(400).send('required date param');
            const isOk = checkFormatDate(dateString);

            if (!isOk) return res.status(400).send('invalid data format');
            const date = new Date(dateString)
            const response = await new ReportController().getUserReport(idUser, date)

            if (response.length === 0) return res.status(204).send()
            return res.status(200).send(response[0])
        } catch (err) {
            console.log(err)
        }


    }

    async updateSelf(req, res) {
        try {
            const reportId = req.params.idReport;
            if (!reportId) return res.status(400).json('wymagany id raportu')

            const data = req.body;
            const isOk = validateReport(data)

            //TODO VALIDATE BODY
            const response = await new ReportController().update(reportId, data)
            res.status(200).json(response)
        } catch (err) {
            console.log(err)
            res.status(err.status || 500).send('nie udało się zaktualizować raportu')
        }

    }

    addSelf(req, res) {

    }
    // async add(req, res) {
    //     const data = req.body;

    // }
}

module.exports = ReportsRouter;