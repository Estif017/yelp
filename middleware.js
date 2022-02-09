const Campground = require('./models/campground');
const Review = require('./models/reviews');
const { campgroundSchemas, reviewSchemas } = require('./schemas');
const ExpressError = require('./utils/expressError');

module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchemas.validate(req.body);
	if (error) {
		const message = error.details.map((err) => err.message).join(',');
		throw new ExpressError(400, message);
	} else {
		next();
	}
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchemas.validate(req.body);
	if (error) {
		const message = error.details.map((err) => err.message).join(',');
		throw new ExpressError(400, message);
	} else {
		next();
	}
};

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be logged in first');
		return res.redirect('/login');
	}
	next();
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash('error', "you don't have permission");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', "you don't have permission");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};
