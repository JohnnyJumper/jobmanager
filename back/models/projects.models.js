const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
	name: String,
	pictures: {
		type: [String],
		default: undefined
	},
	desc: String
});

module.exports = mongoose.model('projects', projectSchema);