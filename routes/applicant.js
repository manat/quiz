
var Applicant = require('../models/applicant');
var Exam = require('../models/exam');
var Question = require('../models/question');

var populateQuestions = function(exam, callback) {
  Question.find({}, function(err, questions) {
    if (err) {
      console.log('[ERROR] Unable to find questions. \n' + err);
      callback(err);
    }

    questions.forEach(function(question) {
      var item = {};
      item.question = [question];
      console.log(question._id + ' : ' + exam);
      exam.items.push(item);
    });

    callback();
  });
};

exports.list = function(req, res) {
  res.send("respond with a resource");
};

exports.new = function(req, res) {
  res.render('applicants/new');
};

exports.show = function(req, res) {
  Applicant.findById(req.params.id, function(err, applicant) {
    Exam.findOne({ applicant: applicant._id })
      .sort('-created_at')
      .select('_id')
      .exec(function (err, exam) {
        if (err || !exam) {
          console.log('[ERROR]: ' + Date.now + '\n' + err);
          return;
        }

        res.render('applicants/show', { 
          applicant: applicant, 
          nextLink: '/exams/' + exam.id
        });
      });
  });
}

exports.create = function(req, res) {
  var applicant = new Applicant({ 
    fullname: req.body.fullname, 
    position: req.body.position,
    notes: req.body.notes
  });

  var exam = new Exam({ applicant: applicant, items: [] });
  populateQuestions(exam, function(err) {
    if (err) {
      return;
    }

    exam.save(function(err) {
      if (err) {
        console.log("[ERROR] Failed to create an Exam for this applicant. " + exam);
        console.log("\n" + err);
      } 
      else {
        // link exam to applicant.
        applicant.exams.push(exam);

        applicant.save(function(err) {
          if (err) {
            console.log("[ERROR] Failed to save this applicant. " + applicant);
            console.log("\n" + err);
          }
          else {
            res.cookie(applicant._id, 
              { authenticated: true }, 
              { signed: true, httpOnly: true, maxAge: (120 * 60 * 1000) }
            );

            res.redirect('/applicants/' + applicant._id);
          }
        });
      }
    });
  });
}
