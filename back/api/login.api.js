const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const admins = require('../models/admins.models');
const errors = require('./errors');



router.post('/check', (req, res) => {
	const {login, password} = req.body;
	admins.findOne({username: login}, (err, doc) => {
		if (err) return res.json({success: false, err});
		if (!doc) return res.json({success: false, err: errors.wrongCredentials});
		if (bcrypt.compareSync(password, doc.hash)) return res.json({success: true}); 
		return res.json({success: false, err: errors.wrongCredentials});
	});
});

router.post('/createAdmin', (req, res) => {
	const {login, password} = req.body;

	if (!login || !password) return res.json({success: false, err: errors.wrongCredentials});
	const encryptedPassword = bcrypt.hashSync(password, 10);
	let admin = new admins();

	admin.username = login;
	admin.hash = encryptedPassword;
	admin.save(err => {
		if (err) return res.json({success: false, err});
		return res.json({success: true, data: admin});
	});
});


module.exports = router;