const expires = require('express');
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const routes = expires.Router();

routes.get('/register', (req, res) => {
	res.render('user/register');
});

routes.post(
	'/register',
	catchAsync(async (req, res, next) => {
		try {
			const { email, username, password } = req.body;
			const user = new User({ email, username });
			const registeredUser = await User.register(user, password);
			req.login(registeredUser, (err) => {
				if (err) return next(err);
				req.flash('success', `Welcome to Yelp ${registeredUser.username}`);
				res.redirect('/campgrounds');
			});
		} catch (error) {
			req.flash('error', error.message);
			res.redirect('/register');
		}
	})
);

routes.get('/login', (req, res) => {
	res.render('user/login');
});

routes.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	(req, res) => {
		const redirect = req.session.returnTo || '/campgrounds';
		delete req.session.returnTo;
		req.flash('success', 'Welcome back');
		res.redirect(redirect);
	}
);

routes.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Goodbye!');
	res.redirect('/campgrounds');
});

module.exports = routes;
