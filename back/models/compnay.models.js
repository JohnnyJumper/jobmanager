const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const company = new Schema({
	name: String,
	link: String,
});

module.exports = mongoose.model('company', company);