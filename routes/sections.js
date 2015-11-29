var express = require('express');
var router = express.Router();

/**
* GET sectionlist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('sectionlist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add section
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('sectionlist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to delete section
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('sectionlist');
	var provinceToDelete = req.params.id;
	collection.remove({'_id': provinceToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific section by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificsectionbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('sectionlist');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update section
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('sectionlist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;