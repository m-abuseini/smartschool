var express = require('express');
var router = express.Router();

/**
* GET triplist
*/
router.get('/triplist',function(req,res){
	var db = req.db;
	var collection = db.get('triplist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add trip
*/
router.post('/addtrip',function(req,res){
	var db = req.db;
	var collection = db.get('triplist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deletetrip
*/
router.delete('/deletetrip/:id',function(req,res){
	var db = req.db;
	var collection = db.get('triplist');
	var tripToDelete = req.params.id;
	collection.remove({'_id': tripToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific trip by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecifictripbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('triplist');
	var tripToGet = req.params.id;
	collection.findOne({_id:tripToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update trip
*/
router.post('/updatetrip',function(req,res){
	var db = req.db;
	var collection = db.get('triplist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;