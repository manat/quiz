
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var error = require('./routes/error');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Bns*IK4TL<Rfc?E[Lli%K*Xph'));
app.use(express.session({ secret: 'hpX*K%ilL[E?cfR<LT4KI*snB' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(error.logError);
app.use(error.errorHandler);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/quiz_dev');

// load routes
require('./routes')(app, passport); 

// init
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
