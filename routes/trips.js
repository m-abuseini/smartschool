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



// router.get('/setup',function(req,res){
//   var newTrip = new Trip({
// 	name		: 	"trip 1 - pickup points", 
// 	language	:	"langauge_id",
// 	bus			:	"566f0e5259536c10366d7268",
// 	bus_teacher	:	"teacher_id",
// 	type		: 	"pickup",
// 	pickup_points	: 	[
// 	{
// 		name: "home",
// 		pickup_id: "5662d628e62c68ec57fd961f",
// 		latitude : "31.978268",
// 		longitude: "35.890762"
// 	},
// 	{
// 		name: "work",
// 		pickup_id: "5662d65ca097c294661b64f8",
// 		latitude : "31.971961",
// 		longitude: "35.832494"
// 	},
// 	{
// 		name: "home 2",
// 		pickup_id: "56687e0f638cd98488c81791",
// 		latitude : "40.1231",
// 		longitude: "45.1231"
// 	}],
// 	drop_points		: 	[],
// 	active	: 	false
//   });

//   newTrip.save(function(err){
//     if(err) throw err;
// 	    console.log("newTrip Added ");
// 	    res.json({success: true, message: "newTrip added successfully"});
//   });
// });



router.get('/gettrip',function(req,res){
	var db = req.db;
	var collection = db.get('trips');
	var tripId = req.query.id;
	if(tripId == undefined || tripId == null){
		res.json({success: false,message: "please provide an ID for the trip "});
		return;
	}
	collection.findOne({_id:tripId},{},function(e,docs){
		res.json({success:true,trip:docs});
	});
});



router.get('/gettripbypoint',function(req,res){
	var db = req.db;
	var collection = db.get('trips');
	var tripType = req.query.type;
	var pointId = req.query.pointId;

	if(tripType == undefined || tripType == null || pointId == undefined || pointId == null){
		res.json({success: false,message: "missing params "});
		return;
	}
	collection.find({type:tripType},{},function(e,docs){
		for(doc in docs){
			var pointsobjarray = docs[doc][tripType+'_points'];
			for(obj in pointsobjarray){
				if(pointsobjarray[obj][tripType+'_id'] === pointId){
					res.json({success:true,trip:docs[doc]});
				}
			}
		}
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