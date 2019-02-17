const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const job = new Schema({
	name: String,
	link: String,
	status: String,
	date: {
		noresponse: Date,
		responded: Date,
		interview: Date,
		rejected: Date
	}
});

module.exports = mongoose.model('job', job);