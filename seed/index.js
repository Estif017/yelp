const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose
	.connect('mongodb://localhost:27017/yelp-camp')
	.then(() => console.log('Connected to the database'))
	.catch((error) => console.log('Error happening', error));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)}, ${sample(places)}`,
		});
		await camp.save();
	}
};

seedDB().then(() => mongoose.connection.close());