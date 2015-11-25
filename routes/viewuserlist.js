var express = require('express');
var router = express.Router();

/* GET login Page */
router.get('/', function(req, res, next) {
  res.render('viewuserlist', { title: 'SMARTSCHOOl - View User' });
  //res.render("../views/index.html");
});

module.exports = router;