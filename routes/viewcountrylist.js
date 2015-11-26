var express = require('express');
var router = express.Router();

/* GET country Page */
router.get('/', function(req, res, next) {
  res.render('viewcountrylist', { title: 'SMARTSCHOOl - View country' });
  //res.render("../views/index.html");
});

module.exports = router;