
const { Console } = require('console');
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
const validateTaskReport = (tasks) => {

    let isOk = true;
    tasks.forEach(({ taskId, name, intensityTime, parametrized, time }) => {
        if (!taskId) isOk = false;
        if (!name) isOk = false;

        if (typeof parametrized !== 'boolean') isOk = false;

        if (parametrized === true) {
            if (typeof intensityTime !== 'number' || intensityTime < 0) isOk = false;
        }
        else if (parametrized === false) {
            if (typeof time !== 'number' || time < 0) isOk = false;
        }

    })
    return isOk;
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
        this.router.get('/self/:date', checkPermission(PERMISSION.USER), this.getSelf.bind(this));
        this.router.get('/filters', this.getBy.bind(this));//add admin middleware
        this.router.put('/:idReport', checkPermission(PERMISSION.USER), this.updateSelf.bind(this));
    }


    async getBy(req, res) {
        const { start, end, id } = req.query;

        const isOkDateStart = checkFormatDate(start);
        const isOkDateEnd = checkFormatDate(end);

        if (!isOkDateStart || !isOkDateEnd) return res.status(400).json('invalid data');

        const idEmployee = id || ''
        const response = await new ReportController().getBeteen(start, end, idEmployee)
        res.status(200).json(response)
    }
    async create(req, res) {
        const dateString = req.params.date;
        const idUser = req.token.id;
        if (!dateString) return res.status(400).send('invalid data');
        const isOk = checkFormatDate(dateString);

        if (!isOk) return res.status(400).send('invalid data');
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

            if (!dateString) return res.status(400).send('invalid data');
            const isOk = checkFormatDate(dateString);

            if (!isOk) return res.status(400).send('invalid data');
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
            if (!reportId) return res.status(400).json('invalid data')

            const data = req.body;
            const reportIsOk = validateReport(data)
            const isOk = validateTaskReport(data.tasks)
            if (!isOk) return res.status(400).json('invalid data')
            //TODO VALIDATE BODY
            const response = await new ReportController().update(reportId, data)
            res.status(200).json(response)
        } catch (err) {
            res.status(err.status || 500).send('nie udało się zaktualizować raportu')
        }

    }

}

module.exports = ReportsRouter;