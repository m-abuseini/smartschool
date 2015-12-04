var express = require('express');
var router = express.Router();
var drop_point = require('../models/drop_point');


/**
* GET drop_points
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('drop_points');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});




router.get('/setup',function(req,res){
  var newdrop_point = new drop_point({
	name: "home",
	student_id: "student_id",
	province_id: "address_province_id",
	street_name: "Qatri ben fujaa",
	building_number: "7",
	appartment_number: "1",
	latitude : "31.978268",
	longitude: "35.890762",
	primary: true
  });

  newdrop_point.save(function(err){
    if(err) throw err;
	    console.log("drop_point Added ");
	    res.json({success: true}, message: "drop_point added successfully");
  });
});


/*
* Post to add drop_points
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('drop_points');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to delte drop_points
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('drop_points');
	var drop_pointToDelete = req.params.id;
	collection.remove({'_id': drop_pointToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific drop points by id
* 
*/
router.get('/getspecificdropbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('drop_points');
	var drop_pointToGet = req.params.id;
	collection.findOne({_id:drop_pointToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update drop_point
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('drop_points');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;