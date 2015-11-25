var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/users/index', { title: 'SMARTSCHOOl - USERS' });
  //res.render("../views/index.html");
});

module.exports = router;
