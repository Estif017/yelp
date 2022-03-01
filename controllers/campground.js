const Campground = require('../models/campground');

module.exports.allCampgrounds = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campground/index', { campgrounds });
};

module.exports.renderNewCampgroundForm = (req, res) => {
	res.render('campground/new');
};

module.exports.createNewCampground = async (req, res) => {
	const campground = new Campground(req.body.campground);
	campground.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	campground.author = req.user._id;
	await campground.save();
	req.flash('success', 'Successfully Made a new campground!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderShowCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({ path: 'reviews', populate: { path: 'author' } })
		.populate('author');
	if (!campground) {
		req.flash('error', `Can't find campground`);
		return res.redirect('/campgrounds');
	}
	res.render('campground/show', { campground });
};

module.exports.editCampgrounds = async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(
		req.params.id,
		req.body.campground,
		{ runValidators: true }
	);
	campground.save();
	req.flash('success', 'Successfully updated campground!');
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderEditCampgroundsForm = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if (!campground) {
		req.flash('error', `Can't find campground`);
		return res.redirect('/campgrounds');
	}
	res.render('campground/edit', { campground });
};

module.exports.deleteCampgrounds = async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	req.flash('success', 'Successfully deleted campground!');
	res.redirect(`/campgrounds`);
};
