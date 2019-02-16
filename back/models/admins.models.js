const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
	username: String,
	hash: String
});

module.exports = mongoose.model('admins', adminSchema);