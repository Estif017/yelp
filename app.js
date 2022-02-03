const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const path = require('path');
const campgrounds = require('./routes/campground');
const reviews = require('./routes/review');
const ExpressError = require('./utils/expressError');

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

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/review', reviews);

app.get('/', (req, res) => {
	res.redirect('/campgrounds');
});

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
