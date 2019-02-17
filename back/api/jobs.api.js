const express = require('express');
const router = express.Router();

const errors = require('./errors');
const job = require('../models/jobs.models');


router.get('/projects', (req, res) => {
	job.find({},(err, docs) => {
		if (err) return res.json({success: false, err, data:req.body});
		return res.json({success: true, data: docs});
	});
})


router.post('/add', (req, res) => {
	const {name, link, status, date} = req.body;
	console.log({name, link, status, date});
	if (!name || !link || !status)	return res.json({success: false, err: errors.missingInput})

	let newJob = new job();
	newJob.name = name;
	newJob.link = link;
	newJob.status = status;
	newJob.date[status] = date ? date : new Date();

	newJob.save(err => {
		if (err) return res.json({success: false, err, data: req.body});
		return res.json({success: true, data: job});
	})
})


router.post('/update/:id', (req, res) => {
	const {id} = req.params;
	const {update} = req.body;

	job.findOne({_id: id}, (err, doc) => {
		if (err) return res.json({success: false, err});
		doc.status = update.status;
		doc.date[update.status] = new Date();
		doc.save( err => {
			if (err) return res.json({success: false, err});
			return res.json({success: true});
		});
	})	  
})


router.post('/delete/:id', (req, res) => {
	const {id} = req.params;
	if (!id) return res.json({success: false, err: errors.missingInput})
	job.deleteOne({_id: id}, (err) => {
		if (err) return res.json({success: false, err});
		return res.json({success: true});
	});
})


module.exports = router;