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
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)}, ${sample(places)}`,
			geometry: {
				type: 'Point',
				coordinates: [-90.73333, 14.5667],
			},
			images: [
				{
					url: 'https://res.cloudinary.com/es-yelp/image/upload/v1646154854/yelpCamp/iqhz3fxzerndt4ux0evw.jpg',
					filename: 'yelpCamp/iqhz3fxzerndt4ux0evw',
				},
				{
					url: 'https://res.cloudinary.com/es-yelp/image/upload/v1646154854/yelpCamp/uujwwztxpkstkryvosrl.jpg',
					filename: 'yelpCamp/uujwwztxpkstkryvosrl',
				},
			],
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
			price,
			author: '6202b9f4cffe8f021b0b22e4',
		});
		await camp.save();
	}
};

seedDB().then(() => mongoose.connection.close());
