var express = require('express');
var router = express.Router();
var Pickup_point = require('../models/pickup_point');
var Address = require('../models/address');
var Trip = require('../models/trip');

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




// router.get('/setup',function(req,res){
//   var newPickup_point = new Pickup_point({
// 	name: "home",
// 	student_id: "student_id",
// 	province_id: "address_province_id",
// 	street_name: "Qatri ben fujaa",
// 	building_number: "7",
// 	appartment_number: "1",
// 	latitude : "31.971961",
// 	longitude: "35.832494",
// 	primary: true
//   });

//   newPickup_point.save(function(err){
//     if(err) throw err;
// 	    console.log("Pickup_point Added ");
// 	    res.json({success: true, message: "Pickup_point added successfully"});
//   });
// });


// router.get('/setup',function(req, res){
// 	// get a user with ID of 1
// 	Pickup_point.findById("5662d65ca097c294661b64f8", function(err, pickup_point) {
// 	  if (err) throw err;

// 	  // change the users location
// 	  pickup_point.student_id = "5662e291079127605bae8585";

// 	  // save the user
// 	  pickup_point.save(function(err) {
// 	    if (err) throw err;

// 	    console.log('Pickup_point successfully updated!');
// 	    res.json({success: true});
// 	  });

// 	});
// });


/*
* Post to add address
*/
router.post('/add',function(req,res){
	var student_id = req.body.student_id,
		address_id = req.body.address_id,
		trip_id    = req.body.trip_id,
		latitude   = req.body.latitude,
		longitude  = req.body.longitude;

	if(student_id == null || student_id == undefined
	  	|| address_id == null || address_id == undefined
		|| trip_id == null || trip_id == undefined
		|| latitude == null || latitude == undefined
		|| longitude == null || longitude == undefined){
		res.json({success: false, message: "error : one or more of the core fields are empty"});
	}else{

		var newpickup_point = new Pickup_point({
			name: req.body.name != null || req.body.name != undefined ? req.body.name : "مكان الصعود" ,
			student_id: req.body.student_id,
			province_id: req.body.province_id,
			street_name: req.body.street_name,
			building_number: req.body.building_number,
			appartment_number: req.body.appartment_number,
			latitude : req.body.latitude,
			longitude: req.body.longitude,
			primary: req.body.primary == undefined ? true : req.body.primary,
			trip_id: trip_id
		});
		newpickup_point.save(function(err,pickPoint){
		    if(err) {
		    	console.log(err);
		    } else{
		    	addPointToAddress(req,res,pickPoint);
		    }
		});
	}
});



var addPointToAddress = function(req,res,pickPoint){
	var address_id = req.body.address_id;

	Address.findById(req.body.address_id,function(err,address){
		if(err) throw err;
		var pickPointPointObj = {
								name: pickPoint.name,
								pickup_point_id: pickPoint._id,
								primary : pickPoint.primary
							};

		//if(address.pickup_points == null){
			address.pickup_points = [];
		//}
		address.pickup_points.push(pickPointPointObj);

		address.save(function(err){
			if(err) { 
				console.log(err);
			}else{
				addPointToTrip(req,res,pickPoint,pickPointPointObj,address);
			}
		});
	});
}

var addPointToTrip = function(req,res,pickPoint,pickPointPointObj,address){
	var trip_id = req.body.trip_id;
	Trip.findById(trip_id,function(err,trip){
						
		pickPointPointObj.latitude = req.body.latitude;
		pickPointPointObj.longitude = req.body.longitude;
		
		if(trip.pickup_points == null){
			trip.pickup_points = [];
		}

		trip.pickup_points.push(pickPointPointObj);

		trip.save(function(err,trip){
			res.json({success: true, message: "pickup_point added successfully","trip": trip});
		});
	});
}









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
router.get('/getpickuppoint',function(req,res){
	var db = req.db;
	var collection = db.get('pickup_points');
	var addressToGet = req.query.id;
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