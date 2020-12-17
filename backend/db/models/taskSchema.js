const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const taskSchema = new Schema({
    id: ObjectId,
    name: { type: String, required: true, unique: true },
    group: { type: String, required: true, },
    parameterized: { type: Boolean, required: true },
    intensityTime: { type: Number },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
