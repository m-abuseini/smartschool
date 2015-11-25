var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/**
* GET User LIST
*/
router.get('/userlist',function(req,res){
	var db = req.db;
	var collection = db.get('userlist');
	//console.log(collection);
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

/*
* Post to addUser
*/
router.post('/adduser',function(req,res){
	var db = req.db;
	var collection = db.get('userlist');
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
router.delete('/deleteuser/:id',function(req,res){
	var db = req.db;
	var collection = db.get('userlist');
	var userToDelete = req.params.id;
	collection.remove({'_id': userToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific user
* this will not be used now as all the data is saved on javascript object. 
*/
router.get('/getspecificuser/:id',function(req,res){
	var db = req.db;
	var collection = db.get('userlist');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});

/*
* Post to update user
*/
router.post('/updateuser',function(req,res){
	var db = req.db;
	var collection = db.get('userlist');
	//console.log(collection);
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

module.exports = router;
