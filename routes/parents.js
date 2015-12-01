var ParentModel = require('./model/Parent');
var express = require('express');
var router = express.Router();

/**
* GET parentlist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('parentlist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add parent
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('parentlist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

exports.add = function(req,res){

}




/*
* DELETE to delete parent
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('parentlist');
	var provinceToDelete = req.params.id;
	collection.remove({'_id': provinceToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific parent by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificparentbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('parentlist');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update parent
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('parentlist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;