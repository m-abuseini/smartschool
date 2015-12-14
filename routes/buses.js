// user_type = 3
var express = require('express');
var router = express.Router();
var Bus = require('../models/bus');
var User = require('../models/user');

/**
* GET buslist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('buses');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});


// router.get('/setup',function(req,res){
//   var newBus = new Bus({
// 	language:   "1",
// 	number: "1",
// 	bus_driver:{
// 		name: "bus driver name",
// 		license: "photo _ URL",
// 		age: "22",
// 		phone_number : "123214"
// 	},
// 	bus_details : {
// 		maker: "hyundai",
// 		model: "bus",
// 		plate_number: "12-34567",
// 		capacity: "30"
// 	},
// 	trips: [],
// 	school_id: "school_id",
// 	location: {
// 		latitude: "34123",
// 		longitude: "34123"
// 	},
// 	email: "bus@zlious.com"
//   });

//   newBus.save(function(err){
//     if(err) throw err;
    
//     var newuser = new User({
// 	    name: newBus.number, 
// 		password: "123", 
// 		type: 3,
// 		refid: newBus._id,
// 		email: newBus.email
// 	  });
// 	  newuser.save(function(err){
// 	    if(err) throw err;

// 	    console.log("newBus added");
// 	    res.json({success: true,bus: newBus});
// 	  });
//     //console.log("newParent added");
//     //res.json({success: true});
//   });
// });


//  router.get('/setup',function(req,res){
//  	Bus.findById("566f0e5259536c10366d7268",function(err,bus){
// 		if(bus){
// 			console.log(bus);
// 			var obj1 = {
// 					trip_id: "566f1abd3e5a847805b05526",
// 					type: "drop",
// 					name: "trip 1 - drop points"
// 				};
// 			var obj2 = 	{
// 					trip_id: "566f1be26933889846bcb681",
// 					type: "pickup",
// 					name: "trip 1 - pickup points"
// 				};
// 			bus.trips.push(obj1);
// 			bus.trips.push(obj2);

// 			bus.save(function(err){
// 				if(err) throw err;

// 				console.log(bus);
// 				res.json({success: true,bus:bus});
// 			});			
// 		}else{
// 			console.log("bus not found");
// 		}
// 	});
// });







/*
* Post to add bus
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('buses');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to deletebus
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('buses');
	var busToDelete = req.params.id;
	collection.remove({'_id': busToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific bus by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificbusbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('buses');
	var busToGet = req.params.id;
	collection.findOne({_id:busToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update bus
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('buses');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;