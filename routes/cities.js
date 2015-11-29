var express = require('express');
var router = express.Router();

/**
* GET citylist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('citylist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add city
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('citylist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deletecity
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('citylist');
	var cityToDelete = req.params.id;
	collection.remove({'_id': cityToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific city by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificcitybyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('citylist');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update city
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('citylist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;