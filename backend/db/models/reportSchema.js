const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const taskReportSchema = new Schema({
    name: { type: String },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    parameterized: { type: Boolean },
    count: { type: Number },
    time: { type: Number },
    intensityTime: { type: Number }
});

const reportSchema = new Schema({
    id: ObjectId,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    // userId: { type: String },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    date: { type: Date },
    tasks: [taskReportSchema],
    confirmed: { type: Boolean, default: false },
    description: { type: String }
});

module.exports = mongoose.model('Report', reportSchema);
