const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const job = new Schema({
	title: String,
	date: String,
	responded: Boolean,
	companyID: String,
});

module.exports = mongoose.model('job-version-2', job);