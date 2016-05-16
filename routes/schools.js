var express = require('express');
var router = express.Router();
var School = require('../models/school');
var User = require('../models/user');
var Bus = require('../models/bus');
var Student = require('../models/student');

// /**
// * GET schoollist
// */
// router.get('/list',function(req,res){
// 	var db = req.db;
// 	var collection = db.get('schoollist');
// 	collection.find({},{},function(e,docs){
// 		res.json(docs);
// 	});
// });



// /*
// * Post to add school
// */
// router.post('/add',function(req,res){
// 	var db = req.db;
// 	var collection = db.get('schoollist');
// 	collection.insert(req.body, function(err, ersult){
// 		res.send(
// 			(err === null)?{msg: ''}:{msg: err}
// 		);
// 	});
// });

// /*
// * DELETE to deleteschool
// */
// router.delete('/delete/:id',function(req,res){
// 	var db = req.db;
// 	var collection = db.get('schoollist');
// 	var schoolToDelete = req.params.id;
// 	collection.remove({'_id': schoolToDelete},function(err){
// 		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
// 	});
// });


// /*
// * GET  specific school by id
// * this will not be used now as all the data is saved on javascript object. on the browser.
// */
// router.get('/getspecificschoolbyid/:id',function(req,res){
// 	var db = req.db;
// 	var collection = db.get('schoollist');
// 	var userToGet = req.params.id;
// 	collection.findOne({_id:userToGet},{}, function(e, docs){
// 		res.json(docs);
// 	});
// });



// /*
// * Post to update school
// */
// router.post('/update',function(req,res){
// 	var db = req.db;
// 	var collection = db.get('schoollist');
// 	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
// 		res.send(
// 			(err === null)?{msg: ''}:{msg: err}
// 		);
// 	});
// });



// language:   String,
// 	name: String,
// 	location: {},
// 	email: String,
// 	phone_number: String


router.post('/add',function(req,res){
	var schoolName = req.body.school_name,
		schoolEmail = req.body.school_email,
		schoolNumber = req.body.school_number;

		console.log(schoolName);
		console.log(schoolEmail);
		console.log(schoolNumber);
		//issue in the validation :S

	if((schoolName == undefined || schoolName == null) || ((schoolEmail == null || schoolEmail == undefined) || (schoolNumber == null || schoolNumber == undefined) )){
		res.json({success: false,message: "wrong or empty values"});
	}else{
		var newSchool = new School({
			language:   req.body.school_language != undefined || req.body.school_language != null ? req.body.school_language : "",
			name: schoolName,
			location: {},
			email: schoolEmail != undefined && schoolEmail != null ? schoolEmail : "",
			phone_number: schoolNumber != undefined && schoolNumber != null ? schoolNumber : ""
		});

		newSchool.save(function(err,school){
			if(err){
				console.log(err);
				res.json({success: false,message: "error saving school"});
			}else{
				
				addSchoolToUsers(req,res,school);
				//res.json({success: true, message: "school added successfully ","school": school});
			}
		});
	}
}); 

var addSchoolToUsers = function(req,res,school){
	var newUser = new User({
		name: school.name, 
	    password: "123", 
	    type: 4,
	    refid: school._id,
	    email: school.email,
	    phone_number: school.phone_number
	});

	newUser.save(function(err,user){
		if(err){
			console.log(err);
			res.json({success: false,message: "failed to save school as a user"});
		}else{
			res.json({success: true, message: "school added successfully ","school": school});
		}
	});
}


router.post('/update',function(req,res){
	var schoolName = req.body.school_name,
		schoolEmail = req.body.school_email,
		schoolNumber = req.body.school_number,
		schoolId = req.body.school_id;

	if(schoolId == undefined || schoolId == null){
		res.json({success: false,message: "wrong or empty values"});
	}else{
		School.findById(schoolId,function(err,school){
			if(err){
				condole.log(err);
				res.json({success: false,message: "error finding school"});
			}else if(school){
				school.name = schoolName != undefined || schoolName != null ? schoolName : school.name;
				school.email = schoolEmail != undefined || schoolEmail != null ? schoolEmail : school.email;
				school.phone_number = schoolNumber != undefined || schoolNumber != null ? schoolNumber : school.phone_number;

				school.save(function(err,school){
					if(err){
						console.log(err);
						res.json({success: false,message: "error saving school"});
					}else{
						res.json({success: true, message: "school updated successfully ","school": school});
					}
				});

			}else{
				res.json({success: false,message: "error finding school"});
			}
		});
	}
});


router.post('/delete',function(req,res){
	var schoolId = req.body.school_id;
	if(schoolId == undefined || schoolId == null){
		res.json({success: false,message: "wrong or empty values"});
	}else{
		School.remove({_id : schoolId},function(err){
			if(err){
				console.log(err);
				res.json({success: false,message: "couldn't delete school"});
			}else{
				res.json({success: true,message: "school removed successfully"});
			}
		});
	}
});


router.post("/getBuses",function(req,res){
	var schoolId = req.body.school_id;
	
	if(schoolId == undefined || schoolId == null){
		res.json({success: false,message: "wrong or empty values"});
	}else{
		Bus.find({school_id:schoolId},function(err,buses){
			if(err){
				console.log(err);
				res.json({success:false,message:"couldn't find buses"});
			}else{
				console.log(buses);
				res.json({success: true,message:"",buses: buses});
			}
		});
	}
});



router.post("/getStudents",function(req,res){
	var schoolId = req.body.school_id;
	
	if(schoolId == undefined || schoolId == null){
		res.json({success: false,message: "wrong or empty values"});
	}else{
		Student.find({school:schoolId},function(err,students){
			if(err){
				console.log(err);
				res.json({success:false,message:"couldn't find students"});
			}else{
				console.log(students);
				res.json({success: true,message:"",students: students});
			}
		});
	}
});



module.exports = router;