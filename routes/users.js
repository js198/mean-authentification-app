const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//register (dont need users/ because its inherent in the router)
router.post('/register', (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});

	User.addUser(newUser, (err, user) => {
		if(err){
			res.json({success: false, msg: 'Failed to register user.'});
		}else{
			res.json({success: true, msg: 'User registered.'});
		}
	});
});

//authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	console.log('first check: ' + username + password);

	User.getUserByUsername(username, (err, user) => {
		console.log('second check: ' + username);
		if(err) throw err;
		//if there is no user with the passed name in db
		if(!user){
			return res.json({success: false, msg: 'User not found.'});
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch){
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 //1 week
				});

				res.json({
					success: true,
					token: 'JWT '+token,
					user: { //so that you dont send the pasword in .user create your own user object without the pass
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			} else {
				return res.json({success: false, msg: 'Wrong password.'});
			}
		});
	});
});

//profile
// passport.authenticate('jwt', {session:false}) protects the route from open access
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;