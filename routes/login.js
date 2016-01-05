var express = require('express');
var router  = express.Router();
var User    = require('../models/user');
var Parent  = require('../models/parent');
var Student = require('../models/student');
var Bus 	= require('../models/bus');
var jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
var app     = express();
var config  = require('../config');
app.set('superSecret', config.secret); // secret variable
var crypto = require('crypto');



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
			if(user.password != encryptPassword(req.body.password)){
				res.json({success: false, message: 'wrong pasword'});
			}else{
				var token = jwt.sign(user, app.get('superSecret'),{
					expiresIn: 1440*60
				});
				switch(user.type){
					case "1":
						//instead of static id should use refid
						Parent.findOne({_id:user.refid}, function(err,parent){
							if(err) throw err;
							//res.render("map");
							res.json({
								success: true,
								message: 'success',
								token: token,
								user: parent,
								user_type: user.type
							});
						});
						//res.end();
						break;

					case "2":
						Student.findOne({_id:user.refid}, function(err,student){
							if(err) throw err;
							res.json({
								success: true,
								message: 'success',
								token: token,
								user: student,
								user_type: user.type
							});
						});
						break;

					case "3":
						Bus.findOne({_id: user.refid},function(err,bus){
							if(err) throw err;

							res.json({
								success: true,
								message: 'success',
								token: token,
								user: bus,
								user_type: user.type
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


var encryptPassword = function(password) {
    // if (!password || !this.salt) return '';
    // var salt = new Buffer(this.salt, 'base64');
    var salt = "smartSchool_Mseini86593910";
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
 }

module.exports = router;
