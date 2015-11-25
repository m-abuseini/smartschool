var express = require('express');
var router = express.Router();

/**
* GET schoollist
*/
router.get('/schoollist',function(req,res){
	var db = req.db;
	var collection = db.get('schoollist');
	//console.log(collection);
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

module.exports = router;
