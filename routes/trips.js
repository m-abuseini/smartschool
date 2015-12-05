var express = require('express');
var router = express.Router();
var Trip = require('../models/trip');


/**
* GET triplist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('trips');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});



router.get('/setup',function(req,res){
  var newTrip = new Trip({
	name		: 	"trip 1", 
	language	:	"langauge_id",
	bus			:	"bus_id",
	bus_teacher	:	"teacher_id",
	type		: 	"pickup/drop",
	pickup_points	: 	["pickup_point_id_1","pickup_point_id_2"],
	drop_points		: 	["drop_point_id_1","drop_point_id_2"],
	active	: 	true
  });

  newTrip.save(function(err){
    if(err) throw err;
	    console.log("newTrip Added ");
	    res.json({success: true, message: "newTrip added successfully"});
  });
});



/*
* Post to add trip
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('trips');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deletetrip
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('trips');
	var tripToDelete = req.params.id;
	collection.remove({'_id': tripToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific trip by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecifictripbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('trips');
	var tripToGet = req.params.id;
	collection.findOne({_id:tripToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update trip
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('trips');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;