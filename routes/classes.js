var express = require('express');
var router = express.Router();

/**
* GET classlist
*/
router.get('/classlist',function(req,res){
	var db = req.db;
	var collection = db.get('classlist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add class
*/
router.post('/addclass',function(req,res){
	var db = req.db;
	var collection = db.get('classlist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deleteclass
*/
router.delete('/deleteclass/:id',function(req,res){
	var db = req.db;
	var collection = db.get('classlist');
	var classToDelete = req.params.id;
	collection.remove({'_id': classToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific class by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificclassbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('classlist');
	var classToGet = req.params.id;
	collection.findOne({_id:classToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update class
*/
router.post('/updateclass',function(req,res){
	var db = req.db;
	var collection = db.get('classlist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;