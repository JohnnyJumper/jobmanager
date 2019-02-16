const express = require('express');
const router = express.Router();

const errors = require('./errors');
const job = require('../models/jobs.models');

router.post('/add', (req, res) => {
	const {name, link, status, date} = req.body;
	console.log({name, link, status, date});
	if (!name || !link || !status)	return res.json({success: false, err: errors.missingInput})

	let newJob = new job();
	newJob.name = name;
	newJob.link = link;
	newJob.status = status;
	newJob.date = date ? date : new Date();

	newJob.save(err => {
		if (err) return res.json({success: false, err, data: req.body});
		return res.json({success: true, data: job});
	})
})



module.exports = router;