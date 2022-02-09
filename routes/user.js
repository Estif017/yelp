const expires = require('express');
const passport = require('passport');
const user = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');
const routes = expires.Router();

routes
	.route('/register')
	.get(user.renderRegisterForm)
	.post(catchAsync(user.registerUser));

routes
	.route('/login')
	.get(user.renderLoginForm)
	.post(
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
		}),
		user.login
	);

routes.get('/logout', user.logout);

module.exports = routes;
