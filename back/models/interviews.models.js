const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const interview = new Schema({
    status: String,
    date: Date,
    jobID: String,
    type: String
})



module.exports = mongoose.model('Interview', interview);