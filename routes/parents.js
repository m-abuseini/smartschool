// user_type = 1
var express = require('express');
var router = express.Router();
var Parent   = require('../models/parent');
var User = require('../models/user');
var Student = require('../models/student');
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
//   var newParent = new Parent({
// 	language:   "1",
// 	national_id: "1",
// 	personal_documents:  ["id_1",'id_2'],
// 	first_name:   'mahmoud',
// 	middle_name: 'parent',
// 	lastname:   'parent',
// 	place_of_birth: "amman jordan",
// 	date_of_birth:  "new Date",
// 	religion:   "1",
// 	nationality: "1",
// 	gender: "1",
// 	address: "id_1",
// 	children:  [{
// 			child_id : "5662e19d84001efc680a1822",
// 			full_name: "home student",
// 			class: "child_class_id_1",
// 			address: "5662dc9077f7fbe062d4a280",
// 			schhold_id: "child_school_id_1"
// 		},
// 		{
// 			child_id: "5662e291079127605bae8585",
// 			full_name: "work student",
// 			class: "child_class_id_1",
// 			address: "5662dd21b93eb6f4677a106e",
// 			schhold_id: "child_school_id_1"
// 		}],
// 	roles:   ["id_1",'id_2'],
// 	social_status: "1",
// 	education_level:   "1",
// 	work: "1",
// 	family_members_count:  "4",
// 	phone:   "1",
// 	email: "parent@zlious.com",
// 	device_id: "device_id_1"
//   });

//   newParent.save(function(err){
//     if(err) throw err;
    
//     var newuser = new User({
// 	    name: newParent.first_name, 
// 		password: "123", 
// 		type: 1,
// 		refid: newParent._id,
// 		email: newParent.email
// 	  });
// 	  newuser.save(function(err){
// 	    if(err) throw err;

// 	    console.log("user added");
// 	    res.json({success: true});
// 	  });
//     //console.log("newParent added");
//     //res.json({success: true});
//   });
// });


// router.post('/updateParent/:id',function(req,res){
// 	var userToGet = req.params.id;
// 	Parent.findOne({_id: userToGet},function(err,parent){
// 		if(parent){
// 			console.log(parent);
// 			parent.remove(function(err){if (err) throw err; res.json({success: true})})
// 			// parent.children_obj.id_56617733f35a91883d5496bb = obj1;
// 			// parent.children_obj.id_56618b7b0f50e3cc4b9ac5f0 = obj2;
// 			// console.log(parent);
// 			// parent.save(function(err){
// 			// 	if(err) throw err;

// 			// 	console.log(parent);
// 			// 	res.json({success: true});
// 			// });			
// 		}else{
// 			console.log("parent not found");
// 		}
// 	});
// });



router.post('/allParents',function(req,res){
	Parent.find(function(err,parents){
		if(parents){
			for(parent in parents){

				/***
				************ Change the Value of children in Parent Collection into array and keep the values *********

				var oldChildrenValue = parents[parent].children;
				parents[parent].children = [];

				for(var j=0;j<oldChildrenValue.length;j++){
					parents[parent].children.push(oldChildrenValue[j]);
				}
				parents[parent].save(function(err){
					if(err){
						console.log(err);	
					}
				});

				***/

				/*************************
				***************************** add parent ID to each corresponding student */

				var children = parents[parent].children;

				addParentIdToChildren(children,parents[parent]._id);
				
				//console.log(parents[parent]._id);
				// for(child in children){
				// 	console.log(parents[parent]._id);
				// 	Student.findOne({_id: children[child].child_id},function(err,student){
				// 		if(student){
				// 			//if(student.parents == null){
				// 				student.parents = [];	
				// 			//}
				// 			student.parents.push(parents[parent]._id);

				// 			student.save(function(err){
				// 				if(err){
				// 					console.log(err);
				// 				}
				// 			});
				// 		}
						
				// 	});
				// }

				/**************/


				// if(parents[parent].phone_number != null){

				// 	var newuser = new User({
				// 	    name: parents[parent].first_name, 
				// 		password: "123", 
				// 		type: 1,
				// 		refid: parents[parent]._id,
				// 		email: parents[parent].email,
				// 		phone_number: parents[parent].phone_number
				// 	  });
				// 	  newuser.save(function(err){
				// 	    if(err) {
				// 	    	console.log(err);
				// 	    };

				// 	    //console.log("user added");
				// 	    //res.json({success: true});
				// 	  });
				// }else{
				// 	console.log(parents[parent]._id);
				// }
				

				
				//console.log(parents[parent].children);
				//console.log(parents[parent].children.length);
				//console.log(parents[parent].children.constructor);
				// if(parents[parent].children.constructor == Array){
				// 	//console.log("Array obj");
				// }
				// if(parents[parent].children.constructor == Object){
				// 	console.log("Object obj");
				// }
			}
			
			res.json({success: true});
		}
	});
});


var addParentIdToChildren = function(children,parentId){
	for(child in children){
		Student.findOne({_id: children[child].child_id},function(err,student){
			if(student){
				//if(student.parents == null){
					student.parents = [];	
				//}
				student.parents.push(parentId);

				student.save(function(err){
					if(err){
						console.log(err);
					}
				});
			}
			
		});
	}
}


var encryptPassword = function(password) {
    // if (!password || !this.salt) return '';
    // var salt = new Buffer(this.salt, 'base64');
    var salt = "smartSchool_Mseini86593910";
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
 }


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