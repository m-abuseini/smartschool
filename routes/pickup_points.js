var express = require('express');
var router = express.Router();
var Pickup_point = require('../models/pickup_point');


/**
* GET addresslist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('pickup_points');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});




router.get('/setup',function(req,res){
  var newPickup_point = new Pickup_point({
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

  newPickup_point.save(function(err){
    if(err) throw err;
	    console.log("Pickup_point Added ");
	    res.json({success: true}, message: "Pickup_point added successfully");
  });
});


/*
* Post to add address
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('pickup_points');
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
	var collection = db.get('pickup_points');
	var addressToDelete = req.params.id;
	collection.remove({'_id': addressToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific address by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificpickupbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('pickup_points');
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
	var collection = db.get('pickup_points');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;