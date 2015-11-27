var express = require('express');
var router = express.Router();

/**
* GET addresslist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('addresslist');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



/*
* Post to add address
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('addresslist');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deleteaddress
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('addresslist');
	var addressToDelete = req.params.id;
	collection.remove({'_id': addressToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific address by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificaddressbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('addresslist');
	var addressToGet = req.params.id;
	collection.findOne({_id:addressToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update address
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('addresslist');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;