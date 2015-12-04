var express = require('express');
var router = express.Router();
var User   = require('../models/user');
var Parent   = require('../models/parent');


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/**
* GET User LIST
*/
// router.get('/list',function(req,res){
// 	var db = req.db;
// 	var collection = db.get('userlist');
// 	//console.log(collection);
// 	collection.find({},{},function(e,docs){
// 		res.json(docs);
// 	});
// });


/**
* GET User LIST
*/
router.get('/list',function(req,res){
	User.find({}, function(err, users) {
    	res.json(users);
  	});
});




// app.get('/setup',function(req,res){
//   var newuser = new User({
//     name: "mahmoud", 
//       password: "123", 
//       type: "parent",
//       refid: "id_123",
//       email: "parent@zlious.com" 
//   });

//   newuser.save(function(err){
//     if(err) throw err;

//     console.log("user added");
//     res.json({success: true});
//   });
// });






/*
* Post to addUser
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('users');
	//console.log(collection);
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deleteuser
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('users');
	var userToDelete = req.params.id;
	collection.remove({'_id': userToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific user by id
* this will not be used now as all the data is saved on javascript object. 
*/
router.get('/getspecificuserbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('users');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});

/*
* GET  specific user by email
* this to get the user for login 
*/
router.get('/getspecificuserbyemail/:email',function(req,res){
	var db = req.db;
	var collection = db.get('users');
	var userToGet = req.params.email;
	collection.findOne({email:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});


/*
* Post to update user
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('users');
	console.log(req.body);
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ersult + ''}:{msg: err}
		);
	});
});




router.post('/updateuser/:id',function(req,res){
	var userToGet = req.params.id;
	User.findOne({_id: userToGet},function(err,user){
		console.log(user);
		if(user){
			user.remove(function(err){
				if(err) throw err;

				res.json({success: true});
			})
			// user.refid = "565f22ce97f0c5284fb25e6e"
			// user.save(function(err){
			// 	if(err) throw err;
			// 	res.json({success: true});
			// });			
		}else{
			console.log("user not found");
		}
	});
});



module.exports = router;
