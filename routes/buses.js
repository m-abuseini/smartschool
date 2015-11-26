var express = require('express');
var router = express.Router();

/**
* GET buslist
*/
router.get('/buslist',function(req,res){
	var db = req.db;
	var collection = db.get('buslist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add bus
*/
router.post('/addbus',function(req,res){
	var db = req.db;
	var collection = db.get('buslist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deletebus
*/
router.delete('/deletebus/:id',function(req,res){
	var db = req.db;
	var collection = db.get('buslist');
	var busToDelete = req.params.id;
	collection.remove({'_id': busToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific bus by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificbusbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('buslist');
	var busToGet = req.params.id;
	collection.findOne({_id:busToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update bus
*/
router.post('/updatebus',function(req,res){
	var db = req.db;
	var collection = db.get('buslist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;