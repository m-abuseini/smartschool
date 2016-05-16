var express = require('express');
var router = express.Router();
var Drop_point = require('../models/drop_point');
var Address = require('../models/address');
var Trip = require('../models/trip');


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




// router.get('/setup',function(req,res){
//   var newdrop_point = new Drop_point({
// 	name: "work",
// 	student_id: "student_id",
// 	province_id: "address_province_id",
// 	street_name: "Al shaeb",
// 	building_number: "9",
// 	appartment_number: "2",
// 	latitude : "31.971961",
// 	longitude: "35.832494",
// 	primary: true
//   });

//   newdrop_point.save(function(err){
//     if(err) throw err;
// 	    console.log("drop_point Added ");
// 	    res.json({success: true, message: "drop_point added successfully"});
//   });
// });

// router.get('/setup',function(req, res){
// 	// get a user with ID of 1
// 	Drop_point.findById("5662d603e62c68ec57fd961e", function(err, drop_point) {
// 	  if (err) throw err;

// 	  // change the users location
// 	  drop_point.student_id = "5662e291079127605bae8585";

// 	  // save the user
// 	  drop_point.save(function(err) {
// 	    if (err) throw err;

// 	    console.log('drop_point successfully updated!');
// 	    res.json({success: true});
// 	  });

// 	});
// });

/*
* Post to add drop_points
*/
router.post('/add',function(req,res){
	var student_id = req.body.student_id,
		address_id = req.body.address_id,
		trip_id = req.body.trip_id,
		latitude = req.body.latitude,
		longitude = req.body.longitude;	
	if(student_id == null || student_id == undefined
	  	|| address_id == null || address_id == undefined
		|| trip_id == null || trip_id == undefined
		|| latitude == null || latitude == undefined
		|| longitude == null || longitude == undefined){
		res.json({success: false, message: "error : one or more of the core fields are empty"});
	}else{
		var newdrop_point = new Drop_point({
			name: req.body.name != null && req.body.name != undefined ? req.body.name : "مكان النزول" ,
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
		newdrop_point.save(function(err,dropPoint){
			if(err) {
				console.log(err);	
			}else{
				addPointToAddress(req,res,dropPoint);
			}
	  	});
	}
});


var addPointToAddress = function(req,res,dropPoint){
	var address_id = req.body.address_id;
	Address.findById(address_id,function(err,address){
		if(err) throw err;
		var dropPointObj = {
								name: dropPoint.name,
								drop_point_id: dropPoint._id,
								primary : dropPoint.primary
							};
		//if(address.drop_points == null){
			address.drop_points = [];
		//}					
		address.drop_points.push(dropPointObj);
		address.save(function(err, address){
			if(err){
				console.log(err);
			}else{
				addPointToTrip(req,res,dropPoint,dropPointObj,address);
			}
		});
	});
}

var addPointToTrip = function(req,res,dropPoint,dropPointObj,address){
	var trip_id = req.body.trip_id;
	Trip.findById(trip_id,function(err,trip){
		dropPointObj.latitude = dropPoint.latitude;
		dropPointObj.longitude = dropPoint.longitude;
		if(trip.drop_points == null){
			trip.drop_points = [];
		}
		trip.drop_points.push(dropPointObj);
		trip.save(function(err,trip){						
			res.json({success: true, message: "drop_point added successfully","trip": trip});
		
		});
	});
}



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
router.get('/getdroppoint',function(req,res){
	var db = req.db;
	var collection = db.get('drop_points');
	var drop_pointToGet = req.query.id;
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