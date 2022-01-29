const { campgroundSchemas } = require('../schemas');
const ExpressError = require('./expressError');

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchemas.validate(req.body);
	if (error) {
		const message = error.details.map((err) => err.message).join(',');
		throw new ExpressError(400, message);
	} else {
		next();
	}
};

module.exports = validateCampground;
