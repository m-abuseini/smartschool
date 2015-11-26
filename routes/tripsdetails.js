var express = require('express');
var router = express.Router();

/**
* GET tripdetaillist
*/
router.get('/tripdetaillist',function(req,res){
	var db = req.db;
	var collection = db.get('tripdetaillist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add tripdetail
*/
router.post('/addtripdetail',function(req,res){
	var db = req.db;
	var collection = db.get('tripdetaillist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deletetripdetail
*/
router.delete('/deletetripdetail/:id',function(req,res){
	var db = req.db;
	var collection = db.get('tripdetaillist');
	var tripdetailToDelete = req.params.id;
	collection.remove({'_id': tripdetailToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific tripdetail by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecifictripdetailbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('tripdetaillist');
	var tripdetailToGet = req.params.id;
	collection.findOne({_id:tripdetailToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update tripdetail
*/
router.post('/updatetripdetail',function(req,res){
	var db = req.db;
	var collection = db.get('tripdetaillist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;