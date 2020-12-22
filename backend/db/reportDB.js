const Report = require('./models/reportSchema');


class ReportModel {

    constructor() {

    }
    insertReport(userId, date) {
        const report = {
            userId,
            date,
            tasks: [],
            description: ''
        }
        return new Report(report).save();
    }
    getBy(filters) {
        return Report.find(filters)
    }

    update(id, data) {
        return Report.findOneAndUpdate({ _id: id }, data);
    }
}


module.exports = ReportModel;