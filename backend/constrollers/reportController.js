const ReportDB = require('../db/reportDB')
// const { PERMISSION } = require('../consts');

class ReportController {

    constructor() {
        this.reportModel = new ReportDB();
    };

    async createReport(id, dateString) {
        const dateToSave = new Date(dateString)
        try {
            const isExist = await this.reportModel.getBy({ userId: id, date: dateToSave })
            if (isExist.length > 0) {
                const error = new Error('raport już istnieje');
                error.status = 400
                throw error;
            }
            const response = await this.reportModel.insertReport(id, dateToSave);
            const { _id, userId, description, date, tasks, confirmed, parametrized, ...other } = response;

            return { id: _id, userId, description, date, tasks, confirmed, ...other }
        } catch (err) {
            const error = new Error(err.message || err)
            error.status = err.status || 500;
            throw error;
        }
    }
    getRequiredData(responseFronDB) {
        const clearedData = responseFronDB.map(el => {
            const { _id, tasks, confirmed, userId, date, description, ...other } = el
            return { id: _id, tasks, confirmed, userId, date, description }
        })
        clearedData.forEach(element => {
            element.tasks = element.tasks.map(task => {
                const { taskId, name, count, time, intensityTime, parametrized, ...other } = task
                return { taskId, name, count, time, intensityTime, parametrized }
            })
        });
        return clearedData;
    }

    async getUserReport(id, date) {
        const response = await this.reportModel.getBy({ userId: id, date: date })
        const output = this.getRequiredData(response)
        return output;
    }
    async getBeteen(dateStart, dateEnd) {
        const start = new Date(dateStart)
        const end = new Date(dateEnd)
        const filters = { date: { $gte: dateStart, $lte: dateEnd } }

        const response = await this.reportModel.getBy(filters)
        const output = this.getRequiredData(response)
        return output;
    }

    async update(idReport, data) {

        data.date = new Date(data.date)
        data.updated = new Date();
        data.tasks = data.tasks.map(task => {

            const { taskId, name, parametrized, count, time, intensityTime } = task;
            return ({ name, parametrized, taskId, count, time: time || null, intensityTime: intensityTime, })
        })
        const { id, userId, tasks, description, updated, confirmed, ...other } = data;

        return this.reportModel.update(idReport, { userId, tasks, description, updated, confirmed })
    }

}


module.exports = ReportController;