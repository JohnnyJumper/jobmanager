const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const job = new Schema({
	title: String,
	status: String,
	date: Date,
	isResponded: Boolean,
})

module.exports = mongoose.model('jobv2', job);