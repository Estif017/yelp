const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
	res.render('user/register');
};

module.exports.registerUser = async (req, res, next) => {
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
};

module.exports.renderLoginForm = (req, res) => {
	res.render('user/login');
};

module.exports.login = (req, res) => {
	const redirect = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	req.flash('success', 'Welcome back');
	res.redirect(redirect);
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Goodbye!');
	res.redirect('/campgrounds');
};
