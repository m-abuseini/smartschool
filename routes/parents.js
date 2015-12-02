//var ParentModel = require('./model/parentModel');
var express = require('express');
var router = express.Router();
var Parent   = require('../models/parent');
var app = express();

/**
* GET parentlist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('parents');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});


// router.get('/setup',function(req,res){
// 	console.log(req);
// 	console.log(res);
//   var newParent = new Parent({
// 	language:   "1",
// 	national_id: "1",
// 	personal_documents:  ["id_1",'id_2'],
// 	first_name:   'mahmoud',
// 	middle_name: 'parent',
// 	lastname:   'parent',
// 	place_of_birth: "amman jordan",
// 	date_of_birth:  new Date(),
// 	religion:   "1",
// 	nationality: "1",
// 	gender: "1",
// 	addresses: ["id_1",'id_2'],
// 	children:  ["id_1",'id_2'],
// 	roles:   ["id_1",'id_2'],
// 	social_status: "1",
// 	education_level:   "1",
// 	work: "1",
// 	family_members_count:  "1",
// 	phone:   "1",
// 	email: "parent@zelious.com"
//   });

//   newParent.save(function(err){
//     if(err) throw err;

//     console.log("newParent added");
//     res.json({success: true});
//   });
// });






/*
* Post to add parent
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('parents');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

// exports.add = function(req,res){

// }




/*
* DELETE to delete parent
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('parents');
	var provinceToDelete = req.params.id;
	collection.remove({'_id': provinceToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific parent by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificparentbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('parents');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update parent
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('parents');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});


module.exports = router;