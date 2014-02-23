
var Applicant = require('../models/applicant');
var Exam = require('../models/exam');
var Question = require('../models/question');

var populateQuestions = function(exam, callback) {
  Question.find({}, function(err, questions) {
    if (err) { callback(err); }

    questions.forEach(function(question) {
      var item = {};
      item.question = [question];
      console.log(question._id + ' : ' + exam);
      exam.items.push(item);
    });

    callback();
  });
};

exports.list = function(req, res, next) {
  res.send("respond with a resource");
};

exports.new = function(req, res, next) {
  res.render('applicants/new');
};

exports.show = function(req, res, next) {
  Applicant.findById(req.params.id, function(err, applicant) {
    Exam.findOne({ applicant: applicant._id })
      .sort('-created_at')
      .select('_id')
      .exec(function (err, exam) {
        if (err || !exam) {
          return next(err);
        }

        res.render('applicants/show', { 
          applicant: applicant, 
          nextLink: '/exams/' + exam.id
        });
      });
  });
}

exports.create = function(req, res, next) {
  var applicant = new Applicant({ 
    firstname: req.body.firstname, 
    lastname: req.body.lastname, 
    position: req.body.position,
    notes: req.body.notes, 
    created_at: new Date
  });

  var exam = new Exam({ applicant: applicant, items: [] });
  populateQuestions(exam, function(err) {
    if (err) { return next(error); };

    exam.save(function(err) {
      if (err) { return next(err); } 

      // link exam to applicant.
      applicant.exams.push(exam);

      applicant.save(function(err) {
        if (err) { return next(err); } 

        res.cookie(applicant._id, 
          { authenticated: true }, 
          { signed: true, httpOnly: true, maxAge: (120 * 60 * 1000) }
        );

        res.redirect('/applicants/' + applicant._id);
      });
    });
  });
}
