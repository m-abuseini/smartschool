// user_type = 2
var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var User = require('../models/user');

/**
* GET studentlist
*/
router.get('/list',function(req,res){
	var db = req.db;
	var collection = db.get('students');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

// router.get('/setup',function(req,res){
//   var newStudent = new Student({
// 	language:   "1",
// 	national_id: "1",
// 	photo: "photo_url",
// 	personal_documents:  ["id_1",'id_2'],
// 	first_name:   'work student',
// 	middle_name: 'student',
// 	lastname:   'student',
// 	place_of_birth: "amman jordan",
// 	date_of_birth:  "new Date",
// 	religion:   "1",
// 	nationality: "1",
// 	gender: "1",
// 	address: "5662dd21b93eb6f4677a106e",
// 	parents:  [],
// 	roles:   ["id_1",'id_2'],
// 	order_in_family: "1",
// 	health_status: "1",
// 	education_status: "1",
// 	failure_reasons: "1",
// 	financial_aid_type: "1",
// 	family_income: "1",
// 	relief_card_status: "1",
// 	social_status: "1",
// 	family_members_count:  "1",
// 	school: "school_id_1",
// 	class: "class_id_1",
// 	section: "section_is_1",
// 	educational_documents: ["id_1",'id_2'],
// 	phone:   "1",
// 	email: "student2@zlious.com",
// 	device_id: "student-device_id"
//   });

//   newStudent.save(function(err){
//     if(err) throw err;

//     var newuser = new User({
// 	    name: newStudent.first_name, 
// 		password: "123", 
// 		type: 2,
// 		refid: newStudent._id,
// 		email: newStudent.email
// 	  });
// 	  newuser.save(function(err){
// 	    if(err) throw err;

// 	    console.log("user added");
// 	    res.json({success: true, user: newStudent});
// 	  });
//   });
// });

// router.get('/setup',function(req, res){
// 	// get a user with ID of 1
// 	Student.findById("5662e291079127605bae8585", function(err, student) {
// 	  if (err) throw err;

// 	  // change the users location
// 	  student.parents.push("5662e5ef591f97106f69d336");

// 	  // save the user
// 	  student.save(function(err) {
// 	    if (err) throw err;

// 	    console.log('Student successfully updated!');
// 	  });

// 	});
// });


/*
* Post to add student
*/
router.post('/add',function(req,res){
	var db = req.db;
	var collection = db.get('students');
	collection.insert(req.body, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});

/*
* DELETE to delete student
*/
router.delete('/delete/:id',function(req,res){
	var db = req.db;
	var collection = db.get('students');
	var provinceToDelete = req.params.id;
	collection.remove({'_id': provinceToDelete},function(err){
		res.send((err === null) ? {msg : ''} : {msg : 'error = '+ err});
	});
});


/*
* GET  specific student by id
* this will not be used now as all the data is saved on javascript object. on the browser.
*/
router.get('/getspecificstudentbyid/:id',function(req,res){
	var db = req.db;
	var collection = db.get('students');
	var userToGet = req.params.id;
	collection.findOne({_id:userToGet},{}, function(e, docs){
		res.json(docs);
	});
});



/*
* Post to update student
*/
router.post('/update',function(req,res){
	var db = req.db;
	var collection = db.get('students');
	collection.findAndModify({_id:req.body._id},{$set : req.body}, function(err, ersult){
		res.send(
			(err === null)?{msg: ''}:{msg: err}
		);
	});
});





// router.post('/updatestudent/:id',function(req,res){
// 	var userToGet = req.params.id;
// 	Student.findOne({_id: userToGet},function(err,student){
// 		if(student){
// 			student.parents.pop();
// 			student.parents.pop();
			
// 			student.parents.push('565f22ce97f0c5284fb25e6e');
// 			student.save(function(err){
// 				if(err) throw err;

// 				console.log(student);
// 				res.json({success: true});
// 			});			
// 		}else{
// 			console.log("student not found");
// 		}
// 	});
// });


module.exports = router;