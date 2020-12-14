const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    id: ObjectId,
    active: { type: Boolean, default: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permission: { type: Number, required: true },
    mail: { type: String, required: true, unique: true },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
