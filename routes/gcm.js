var express = require('express');
var gcm = require('node-gcm');
var router = express.Router();
var Parent   = require('../models/parent');
var Student   = require('../models/student');
var User = require('../models/user');
var Trip = require('../models/trip');
var app = express();

router.post('/modifydeviceid',function(req,res){
	var deviceId = req.body.device_id;
	var parentId = req.body.id;
	if(deviceId === '' || parentId === ''){
		res.json({success: false,message: 'values should not be empty'});
	}else{
		Parent.findOne({_id: parentId},function(err,parent){
			if(err){
				res.json({success: false, message: "couldn't find a user"});
				throw err;
			}else{
				parent.device_id = deviceId;
				parent.save(function(err){
					if (err) throw err;

					res.json({success: true, message: 'device_id successfully modified',user: parent});
				});
			}
		});
	}
});



router.post('/notifyparent',function(req,res){
	var reqMessage = req.body.message;
	var sutdentId = req.body.id;

	if(reqMessage === '' || sutdentId === '' || reqMessage === null || sutdentId === null){
		res.json({success: false, message:"values shouldn't be empty"});
	}else{
		Student.findOne({_id: sutdentId},function(err,student){
			if (err){
				res.json({success: false, mesage: "error fitching student"});
				throw err;	
			}else{
				
				var parentsArray = student.parents;

				Parent.find({
				    '_id': { $in: parentsArray}
				}, function(err, docs){
					if (err){
						res.json({success: false, mesage: "error fitching student"});
						throw err;	
					}else{

				     for(var i=0; i<docs.length;i++){

				     	var parentDocument = docs[i];

				     	var registrationKey = parentDocument.device_id;	


				     	if(registrationKey== null || registrationKey == ""){
				     		res.json({success: false, message:"no device id found for user"});
				     	}
						var message = new gcm.Message();

						message.addData('msg', reqMessage);

						var regTokens = [registrationKey];

						//  AIzaSyAGu60ywpNVzHCEnzZKwW_6jvdoUbVl8HQ
						var sender = new gcm.Sender('AIzaSyAGu60ywpNVzHCEnzZKwW_6jvdoUbVl8HQ');

						// Now the sender can be used to send messages
						sender.send(message, { registrationTokens: regTokens }, function (err, response) {
						    if(err) console.error(err);
						    else    console.log(response);
						});

				     }
					
					res.json({success: true, mesage: "msgs sent to parents"});

				 	}
				});
			}

		});
	}
});




router.post('/notifyTrip',function(req,res){
	console.log("notify trip");

	var reqMessage = req.body.message;
	var tripId = req.body.trip_id;

	if(reqMessage === '' || tripId === '' || reqMessage === null || tripId === null){
		res.json({success: false, message:"values shouldn't be empty"});
	}else{

		Trip.findOne({_id:tripId},function(err,trip){
			if(err || trip == null){
				console.log(err);
				res.json({success: false, mesage: "error fetching Trip"});
			}else{
				var students = trip.students;
				for(var i=0;i<students.length;i++){
					getStudentParents(req,res,students[i].student_id,reqMessage);
				}
				res.json({success: true, mesage: "msgs sent to parents"});
			}
		});
	}
});

var getStudentParents = function(req,res,student_id,reqMessage){
	Student.findOne({_id: student_id},function(err,student){
		if (err){
			console.log(err);
			res.json({success: false, mesage: "error fitching student"});
		}else{
			var parentsArray = student.parents;
			sendNotificationToParents(req,res,parentsArray,reqMessage);
		}
	});
}

var sendNotificationToParents = function(req,res,parentsArray,reqMessage){
	Parent.find({
		    '_id': { $in: parentsArray}
		}, function(err, docs){
			if (err){
				console.log(err);
				res.json({success: false, mesage: "error fitching parent"});
			}else{

		     for(var i=0; i<docs.length;i++){

		     	var parentDocument = docs[i];

		     	var registrationKey = parentDocument.device_id;	

		     	//console.log(parentDocument._id);
		     	if(registrationKey== null || registrationKey == ""){
		     		//console.log(parentDocument._id);
		     		//res.json({success: false, message:"no device id found for user"});
		     	}
				var message = new gcm.Message();

				message.addData('msg', reqMessage);

				var regTokens = [registrationKey];

				//  AIzaSyAGu60ywpNVzHCEnzZKwW_6jvdoUbVl8HQ
				var sender = new gcm.Sender('AIzaSyAGu60ywpNVzHCEnzZKwW_6jvdoUbVl8HQ');

				// Now the sender can be used to send messages
				sender.send(message, { registrationTokens: regTokens }, function (err, response) {
				    if(err) console.error(err);
				    else {
				    	console.log("GCM response");
				    	console.log(response);
				    }   
				});

		     }

		 	}
		});
}


module.exports = router;