var express = require('express');
var router  = express.Router();
var User    = require('../models/user');
var Parent  = require('../models/parent');
var jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
var app     = express();
var config  = require('../config');
app.set('superSecret', config.secret); // secret variable



/* GET login Page */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'SMARTSCHOOl - Login' });
  //res.render("../views/index.html");
});

router.post('/',function(req, res){
	User.findOne({
		email : req.body.email
	},function(err,user){
		if(err) throw err;
		if(!user){
			res.json({success: false,message: 'User not found'});
		}else if(user){
			if(user.password != req.body.password){
				res.json({success: false, message: 'wrong pasword'});
			}else{
				var token = jwt.sign(user, app.get('superSecret'),{
					expiresInMinutes: 1440
				});
				switch(user.type){
					case "parent":
						//instead of static id should use refid
						Parent.findOne({_id:"565f22ce97f0c5284fb25e6e"}, function(err,user){
							if(err) throw err;
							res.json({
								success: true,
								message: 'success',
								token: token,
								user: user
							});
						});
						break;
					default:
						res.json({
							success: true,
							message: 'success',
							token: token,
							user: user
						});
				}
			}
		}
	});
});




module.exports = router;
