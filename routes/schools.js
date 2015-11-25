var express = require('express');
var router = express.Router();

/**
* GET schoollist
*/
router.get('/schoollist',function(req,res){
	var db = req.db;
	var collection = db.get('schoollist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add school
*/
router.post('/addschool',function(req,res){
	var db = req.db;
	var collection = db.get('schoollist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deleteschool
*/
router.delete('/deleteschool/:id',function(req,res){
	var db = req.db;
	var collection = db.get('schoollist');
	var schoolToDelete = req.params.id;
	collection.remove({'_id': schoolToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific school by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificschoolbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('schoollist');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update school
*/
router.post('/updateschool',function(req,res){
	var db = req.db;
	var collection = db.get('schoollist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;