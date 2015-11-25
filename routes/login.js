var express = require('express');
var router = express.Router();
var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

/* GET login Page */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'SMARTSCHOOl - Login' });
  //res.render("../views/index.html");
});


/*
* Post Login Service
*/
router.post('/',
	passport.authenticate('local',{
		successRedirect: '/loginSuccess',
		successRedirect: '/loginFailure',
		failureFlash: false
}));

router.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

router.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
	 User.findById(id, function(err, user) {
  		done(null, user);
	});
});

// passport.use(new LocalStrategy(function(email, password, done) {
// 	process.nextTick(function() {
// 		User.findOne({email:email},function(err,User){
// 			if (err) { return done(err); }
// 			if (!user) {
// 				return done(null, false, { message: 'Incorrect username.' });
// 			}
// 			if (!user.validPassword(password)) {
// 				return done(null, false, { message: 'Incorrect password.' });
// 			}
// 			return done(null, user);
// 		});
// 		// Auth Check Logic
// 	});
// }));

passport.use('/login',new LocalStrategy({
		usernameField: 'email',
		passReqToCallback : true	
	},
	function(req, email, password, done) {
		console.log(email);
    	console.log(password);
		var db = req.db;
		var collection = db.get('userlist');
		collection.findOne({ email: email }, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
				console.log("user not found");
			    return done(null, false, { message: 'Incorrect email.' });
			}
			if (!user.validPassword(password)) {
			    return done(null, false, { message: 'Incorrect password.' });
			}
			  return done(null, user);
		});
	}
));

module.exports = router;
