const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campground');

router
	.route('/')
	.get(catchAsync(campgrounds.allCampgrounds))
	.post(
		isLoggedIn,
		validateCampground,
		catchAsync(campgrounds.createNewCampground)
	);

router.get('/new', isLoggedIn, campgrounds.renderNewCampgroundForm);

router
	.route('/:id')
	.get(catchAsync(campgrounds.renderShowCampground))
	.put(
		isLoggedIn,
		validateCampground,
		isAuthor,
		catchAsync(campgrounds.editCampgrounds)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampgrounds));
router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.renderEditCampgroundsForm)
);

module.exports = router;
