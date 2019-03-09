const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interview = new Schema({
    type: String,
    status: String,
    date: String,
    jobID: String
});

module.exports = mongoose.model('interview-version-2', interview);