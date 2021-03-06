const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

//router.use(ensureLoggedIn());

const User = require('../models/User');

router.get('/private', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
	res.render('user_profile', { user: req.user });
});

router.get('/list', (req, res) => {
	User.find().then((err, users) => {
		if (err) console.log(err);
		// res.render('userlist', { users });
		res.send(users);
	});
});

/* GET home page */
// router.get("/private/:id", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
//     id = req.params.id;
//     User.findById(id, (err, user) => {
//         if (err) console.log(err);
//         res.render("user_profile", { user });
//     });
// });

// router.get("/edit/:id", ensureLogin.ensureLoggedIn("/auth/login"), (req, res, next) => {
//     let user = req.user;
//     res.render("create/create-user", { user });
// });

router.get('/edit', (req, res, next) => {
	res.render('create/edit-profile', { user: req.user });
});

router.post('/edit', (req, res, next) => {
	if (!req.files) return res.status(400).send('No files were uploaded.');
	const file = req.files.picture;
	req.files.picture.mv(`public/images/${req.user.id}.jpg`, function(err) {
		if (err) return res.status(500).send(err);

		const { username, email, presentation, picture, hobbies, city, relationship_status } = req.body;

		User.findByIdAndUpdate(req.user, {
			username,
			email,
			presentation,
			hobbies,
			picture,
			city,
			relationship_status
		})
			.then(() => {
				console.log('updated user');

				res.redirect('/user_profile');
			})
			.catch((error) => {
				console.log(error);
			});
	});
});

module.exports = router;
