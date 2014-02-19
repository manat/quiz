
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var applicant = require('./routes/applicant');
var question = require('./routes/question');
var exam = require('./routes/exam');
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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/quiz_dev');

// routers
app.get('/', routes.index);
app.get('/applicants/new', applicant.new);
app.get('/applicants/:id', applicant.show);
app.get('/applicants/:applicant_id/exams/:exam_id/questions/:question_id', applicant.question.show);
app.post('/applicants', applicant.create);
app.get('/questions', question.list);
app.get('/exams/:id', exam.show);

// init
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
