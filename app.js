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
var http = require('http');

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
var gcm = require('./routes/gcm');


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

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// var debug = require('debug')('generated-express-app');
// var server = app.listen(app.get('port'), function() {
//     debug('Express server listening on port ' + server.address().port);
// });
// var io = require('socket.io').listen(server);

var port = 3100;
var server = app.listen(port);
var io = require('socket.io').listen(server);
var socketioJwt = require('socketio-jwt');

app.use(express.static(path.join(__dirname, 'public')));

app.set('superSecret', config.secret); // secret variable

// io.set('authorization',socketioJwt.authorize({
//   secret: app.get('superSecret'),
//   handshake: true
// }));


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

mongoose.connect("mongodb://"+config.database);


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
app.use('/api/gcm',gcm);


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



/*********/


/***
 // sending to sender-client only
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');

**/

/******

Dyanamic Name Spaces Stack overFlow link

//http://stackoverflow.com/questions/13143945/dynamic-namespaces-socket-io

****/


// var events = require('events');
// var url = require('url')
//   , ev = new events.EventEmitter();

// // <ns name>: <ns regexp>
// var routes = {
//   // /bus/:id
//   //'bus': '^\\/bus\\/(\\[a-zA-Z0-9]+)$',
//   'bus' : '\/bus\/([a-zA-Z0-9]+)',

//   // /:something/:id
//   'default': '^\\/(\\\w+)\\/(\\d+)$'
// };

// // global entry point for new connections
// io.sockets.on('connection', function (socket) {

//   // extract namespace from connected url query param 'ns'
//   var ns = url.parse(socket.handshake.url, true).query.ns;
//   //console.log('connected ns: '+ns)

//   //
//   for (var k in routes) {
//     var routeName = k;
//     var routeRegexp = new RegExp(routes[k]);

//     // if connected ns matched with route regexp
//     if (ns.match(routeRegexp)) {
//       //console.log('matched: '+routeName)

//       // create new namespace (or use previously created)
//       io.of(ns).on('connection', function (socket) {
        
//         // fire event when socket connecting
//         ev.emit('socket.connection route.'+routeName, socket);
        
//         /**socket.on('tracking-bus',function(data){
          
//           //console.log(data);
//           io.of(ns).emit('push-tracking', data);
//           //ev.emit('push-tracking', data);
//           //io.emit('push-tracking',data);
//         });*/
        
//         socket.on('disconnect', function(){
//           console.log('user disconnected');
//           // socket.removeListener('connection', function(){
//           //   console.log("listener removed");
//           // });
//         });

//         // socket.on('reciever-disconnected',function(){
//         //   socket.removeListener('push-tracking', function(){
//         //     console.log("listener removed --- push-tracking");
//         //   });
//         // });

//         // socket.on('sender-disconnected',function(){
//         //   socket.removeListener('tracking-bus', function(){
//         //     console.log("listener removed --- tracking-bus");
//         //   });
//         // });



//         // @todo: add more if needed
//         // on('message') -> ev.emit(...)
//       });

//       break;
//     }
//   }

//   // when nothing matched
//   // ...
// });

// // // event when socket connected in 'bus' namespace
//  ev.on('socket.connection route.bus', function (s) {
//     s.on('tracking-bus',function(data){
//       var ns = url.parse(s.handshake.url, true).query.ns;
//       io.of(ns).emit('push-tracking', data);
//     });
//    console.log('route[bus] connecting..');
//  });

//  ev.on('socket.disconnect route.bus', function () {
//    console.log('route[bus] disconnect !!!!');
//  });


// // // event when socket connected in 'default' namespace
//  ev.on('socket.connection route.default', function () {
//   console.log('route[default] connecting..');
// });

// /***********/

// // io.sockets.on('connection', function (socket) {
// //   socket.on('receive-bus-id',function(data){
// //     //console.log(data);
// //     //socket.emit('bus-id',data);
// //     socket.broadcast.emit('bus-id',data);
// //   });


// // });

// // io.sockets.on('connection', function (socket) {
  
// //   console.log("socket connected");

// //   var nsp = io.of('http://localhost:3100/bus');
// //   nsp.on('connection',function(socket){
// //     console.log("socket connected");
// //   });
// // });









/***  socket rooms implementation ****/
io.sockets.on('connection', function (socket) {

    // join to room and save the room name
    //room = bus-:busId
    socket.on('join-room', function (room) {
        socket.room = room;
        socket.join(room);
        //console.log('user joined room = ' + room); 
    })

    
    socket.on('bus-data', function(data) {

        //console.log("Client data: " + data);
        //console.log(socket.room);

        // lookup room and broadcast to that room
        //socket.get('room', function(err, room) {
            //room example - https://github.com/learnboost/socket.io
            // neither method works for me
            socket.broadcast.to(socket.room).emit('bus-location',data);
            //io.sockets.in(socket.room).emit('bus-location',data);
            
        //});
    });


    socket.on("disconnect",function(){
      console.log("user disconnected !!!!!!");
      socket.leave(socket.room);
    });


});

/***********/







































console.log('Server listening on http://localhost:' + port);
