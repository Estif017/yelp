const Joi = require('joi');
module.exports.campgroundSchemas = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		price: Joi.number().required().min(0),
		location: Joi.string().required(),
		description: Joi.string().required(),
	}).required(),
	deleteImages: Joi.array(),
});

module.exports.reviewSchemas = Joi.object({
	review: Joi.object({
		body: Joi.string().required(),
		rating: Joi.number().required().min(0).max(5),
	}).required(),
});
