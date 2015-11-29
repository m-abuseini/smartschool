var express = require('express');
var router = express.Router();

/**
* GET teacherlist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('teacherlist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add teacher
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('teacherlist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to delete teacher
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('teacherlist');
	var provinceToDelete = req.params.id;
	collection.remove({'_id': provinceToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific teacher by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificteacherbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('teacherlist');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update teacher
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('teacherlist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;