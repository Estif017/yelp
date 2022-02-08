const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const validateCampground = require('../utils/validateCampground');
const { isLoggedIn } = require('../middleware');

router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campground/index', { campgrounds });
	})
);

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campground/new');
});

router.post(
	'/',
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash('success', 'Successfully Made a new campground!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate(
			'reviews'
		);
		if (!campground) {
			req.flash('error', `Can't find campground`);
			return res.redirect('/campgrounds');
		}
		res.render('campground/show', { campground });
	})
);

router.put(
	'/:id',
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = await Campground.findByIdAndUpdate(
			req.params.id,
			req.body.campground,
			{ runValidators: true }
		);
		campground.save();
		req.flash('success', 'Successfully updated campground!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	'/:id/edit',
	isLoggedIn,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		if (!campground) {
			req.flash('error', `Can't find campground`);
			return res.redirect('/campgrounds');
		}
		res.render('campground/edit', { campground });
	})
);

router.delete(
	'/:id/delete',
	isLoggedIn,
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		req.flash('success', 'Successfully deleted campground!');
		res.redirect(`/campgrounds`);
	})
);

module.exports = router;
