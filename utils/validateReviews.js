const { reviewSchemas } = require('../schemas');
const ExpressError = require('./expressError');

const validateReview = (req, res, next) => {
	const { error } = reviewSchemas.validate(req.body);
	if (error) {
		const message = error.details.map((err) => err.message).join(',');
		throw new ExpressError(400, message);
	} else {
		next();
	}
};

module.exports = validateReview;
