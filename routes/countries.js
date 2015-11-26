var express = require('express');
var router = express.Router();

/**
* GET countrylist
*/
router.get('/countrylist',function(req,res){
	var db = req.db;
	var collection = db.get('coutrylist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add country
*/
router.post('/addcountry',function(req,res){
	var db = req.db;
	var collection = db.get('coutrylist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deletecountry
*/
router.delete('/deletecountry/:id',function(req,res){
	var db = req.db;
	var collection = db.get('coutrylist');
	var countryToDelete = req.params.id;
	collection.remove({'_id': countryToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific country by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificcountrybyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('coutrylist');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update country
*/
router.post('/updatecountry',function(req,res){
	var db = req.db;
	var collection = db.get('coutrylist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;