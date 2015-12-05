var express = require('express');
var router = express.Router();
var Address   = require('../models/address');


/**
* GET addresslist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('addresses');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});







// router.get('/setup',function(req,res){
//   var newAddress = new Address({
// 	language:   "1",
// 	country_id: "address_country_id",
// 	city_id:   'address_city_id',
// 	pickup_points:  [
// 		{
// 			name: "work",
// 			pickup_point_id: "5662d65ca097c294661b64f8",
// 			primary: true
// 	    }
// 	],
//     drop_points:  [
//     	{
// 			name: "work",
// 			drop_point_id: "5662d603e62c68ec57fd961e",
// 			primary: true
// 	    }
//     ],
//     static_address: {}
//   });

//   newAddress.save(function(err){
//     if(err) throw err;
// 	    console.log("address Added ");
// 	    res.json({success: true, message: "address added successfully"});
//   });
// });




/*
* Post to add address
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('addresses');
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
	var collection = db.get('addresses');
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
	var collection = db.get('addresses');
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
	var collection = db.get('addresses');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;