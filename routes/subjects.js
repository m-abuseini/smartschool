var express = require('express');
var router = express.Router();

/**
* GET subjectlist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('subjectlist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add subject
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('subjectlist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deletesubject
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('subjectlist');
	var subjectToDelete = req.params.id;
	collection.remove({'_id': subjectToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific subject by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificsubjectbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('subjectlist');
	var subjectToGet = req.params.id;
	collection.findOne({_id:subjectToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update subject
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('subjectlist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;