const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const path = require('path');
const Campground = require('./models/campground');
const Review = require('./models/reviews');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const validateCampground = require('./utils/validateCampground');
const validateReview = require('./utils/validateReviews');

const app = express();

mongoose
	.connect('mongodb://localhost:27017/yelp-camp')
	.then(() => console.log('Connected to the database'))
	.catch((error) => console.log('Error happening', error));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
	res.redirect('/campgrounds');
});

app.get(
	'/campgrounds',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campground/index', { campgrounds });
	})
);

app.get('/campgrounds/new', (req, res) => {
	res.render('campground/new');
});

app.post(
	'/campgrounds',
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.get(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campground/show', { campground });
	})
);

app.put(
	'/campgrounds/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = await Campground.findByIdAndUpdate(
			req.params.id,
			req.body.campground,
			{ runValidators: true }
		);
		campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
app.delete(
	'/campgrounds/:id/delete',
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		res.redirect(`/campgrounds`);
	})
);

app.get(
	'/campgrounds/:id/edit',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campground/edit', { campground });
	})
);

app.post(
	'/campgrounds/:id/review',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		await review.save();
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.all('*', (req, res, next) => {
	next(new ExpressError(404, 'page Not found'));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh No, Something Went Wrong!';
	res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
	console.log('listening at http://localhost:3000');
});
