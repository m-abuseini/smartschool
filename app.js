var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config'); // get our config file
// Database
var mongo = require('mongodb');
var monk = require('monk');
var mongoose = require('mongoose');
var db = monk(config.database);

// Socket io
 http = require('http');

var routes = require('./routes/index');
var map = require('./routes/map');

// authentication and user login
var login = require('./routes/login');

var User   = require('./models/user');
var Parent   = require('./models/parent');
// authentication and user login -----

//============ --- API ROUTES -----
var api = require('./routes/api');
// --------
var users = require('./routes/users');
var schools = require('./routes/schools');
var parents = require('./routes/parents');
var students = require('./routes/students');
var addresses = require('./routes/addresses');
var drop_points = require('./routes/drop_points');
var pickup_points = require('./routes/pickup_points');
var buses = require('./routes/buses');
var trips = require('./routes/trips');


var countries = require('./routes/countries');
var classes = require('./routes/classes');
var addresses = require('./routes/addresses');
var subjects = require('./routes/subjects');
var languages = require('./routes/languages');
var cities = require('./routes/cities');
var province = require('./routes/province');
var sections = require('./routes/sections');
var personaldocuments = require('./routes/personaldocuments');
var educationaldocuments = require('./routes/educationaldocuments');

var teachers = require('./routes/teachers');
var shifts = require('./routes/shifts');
var roles = require('./routes/roles');
var privilages = require('./routes/privilages');
//var tripsdetails = require('./routes/tripsdetails');
//============ --- API ROUTES ----- ---------------------- //
var viewuserlist = require('./routes/viewuserlist');
var viewschoollist = require('./routes/viewschoollist');
var viewcountrylist = require('./routes/viewcountrylist');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');

var app = express();
// var debug = require('debug')('generated-express-app');
// var server = app.listen(app.get('port'), function() {
//     debug('Express server listening on port ' + server.address().port);
// });
// var io = require('socket.io').listen(server);

var port = 3100;
var server = app.listen(port);
var io = require('socket.io').listen(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//to remove below after dev
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));

// app.use(expressSession({secret: 'mySecretKey'}));
// app.use(passport.initialize());
// app.use(passport.session());

app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use(function(req,res,next) {
  mongoose.connect("mongodb://"+config.database);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    console.log('DB initialised successfully');
    app.locals.db = db;
  });
  next();
});


app.use('/', routes);
app.use('/login', login);
app.use('/map',map);
app.use('/viewuserlist', viewuserlist);
app.use('/viewschoollist', viewschoollist);
app.use('/viewcountrylist', viewcountrylist);
//app.use('/partials/:name', routes.partials);
//============ --- API URL STRUCT -----
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/schools', schools);
app.use('/api/students',students);
app.use('/api/parents',parents);
app.use('/api/addresses',addresses);
app.use('/api/pickup_points', pickup_points);
app.use('/api/drop_points', drop_points);
app.use('/api/buses',buses);
app.use('/api/trips',trips);


app.use('/api/countries',countries);
app.use('/api/classes',classes);
app.use('/api/subjects',subjects);
app.use('/api/languages',languages);
app.use('/api/cities',cities);
app.use('/api/province',province);
app.use('/api/sections',sections);
app.use('/api/personaldocuments',personaldocuments);
app.use('/api/educationaldocuments',educationaldocuments);
app.use('/api/teachers',teachers);
app.use('/api/shifts',shifts);
app.use('/api/roles',roles);
app.use('/api/privilages',privilages);
//app.use('/api/tripsdetails',tripsdetails);
//============ --- API URL STRUCT ----- -------//


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://'+req.headers.host+'3100');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('reseve-bus-id',function(data){
    console.log(data);
    console.log("Long = " + data.long);
    console.log("Lat = " + data.lat);
    socket.broadcast.emit('bus-id',data);
  });
});


module.exports = app;
