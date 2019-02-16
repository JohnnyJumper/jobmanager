const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: (req, files, cb) => (cb(null, './uploads/')),
	filename: (req, file, cb) => {
		cb(null, `${new Date().getTime()}-${file.originalname}`);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);
	else cb(null, false);
} 

const upload = multer({storage, fileFilter});

const projects = require('../models/projects.models');
const errors = require('./errors');

router.get('/projects', (req, res) => {
	projects.find({}, (err, docs) => {
		if (err) return res.json({success: false, err});
		return res.json({success: true, data: docs});
	});
});

router.get('/projects/:id', (req, res) => {
	const {id} = req.params;
	projects.find({_id: id}, (err, doc) => {
		if (err) return res.json({success: false, err});
		return res.json({success: true, data: doc});
	});
});

router.post('/addProject', upload.array('pictures', 6), (req, res) => {
	const { files } = req;
	const {name, desc} = req.body;

	if (!name || typeof name !== 'string')
		return res.json({success: false, err: errors.wrongName, data: req.body});
	if (!desc || typeof desc !== 'string')
		return res.json({success: false, err: errors.noDescription, data: req.body});
	
	let project = new projects();

	project.name = name;
	project.pictures = [];

	files.map(image => project.pictures.push(`/${image.path}`));
	project.desc = desc;

	project.save(err => {
		if (err) return res.json({success: false, err, data: req.body});
		return res.json({success: true, data: project});
	});
});


router.post('/updateProject/:id', (req, res) => {
	const {id} = req.params;
	const {update} = req.body;


	if (!update) return res.json({success: false, err: errors.noChanges, data: req.body});
	const updateKeys = Object.keys(update);
	if (updateKeys.length > 3) return res.json({success: false, err: errors.extraData, data: req.body});
	else {
		for (let key in updateKeys) {
			if (key !== 'name' && key !== 'pictures' && key !== 'desc')
				return res.json({success: false, err: errors.wrongKey, data: req.body});
			if ((key == 'name' || key == 'desc') && typeof key !== 'string')
				return res.json({success: false, err: errors.wrongKeyType, data: req.body});
		}
	}

	projects.updateOne({_id: id}, update, (err, updated) => {
		if (err) return res.json({success: false, err});
		return res.json({success: true, data: updated});
	});
});

router.delete('/deleteProject/:id', (req, res) => {
	const {id} = req.params;
	projects.findById(id, (err, doc) => {
		if (err) return res.json({success: false, err, data: undefined});
		const {pictures} = doc;
		pictures.forEach(picture => fs.unlink(`.${picture}`, (err) => console.error(err)));
		projects.deleteOne({_id: id}, (err) => {
			if (err) return res.json({success: false, err, data: undefined});
			return res.json({success: true, data: undefined});
		});
	});
});

module.exports = router;