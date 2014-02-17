
var Applicant = require('../models/applicant');
var Exam = require('../models/exam');
var Question = require('../models/question');

/*
 * GET applicants listing.
 */

exports.list = function(req, res) {
  res.send("respond with a resource");
};

exports.new = function(req, res) {
  res.render('applicants/new');
};

exports.show = function(req, res) {
  Applicant.findById(req.params.id, function(err, applicant) {
    Exam.findOne({ applicant: applicant._id })
      .exec(function (err, exam) {
        res.render('applicants/show', { applicant: applicant, exam: exam } );
      });
  });
}

/*
 * POST create an applicant.
 */

exports.create = function(req, res) {
  var applicant = new Applicant({ 
    fullname: req.body.fullname, 
    position: req.body.position,
    notes: req.body.notes
  });

  applicant.save(function(err) {
    if (err) {
      console.log(err);
      console.log("Failed to save this applicant. " + applicant);
    }
    else {
      // Prepare exam for this applicant 
      Question.find({}, function(err, questions) {
        var items = [];
        var item = {};
        var exam;

        questions.forEach(function(question) {
          item.question = [question];
          items.push(item);
        });

        exam = new Exam({
          applicant: applicant, 
          items: items
        });

        exam.save(function(err) {
           if (err) {
            console.log(err);
            console.log("Failed to create an Exam for this applicant. " + exam);
          }
        });
      });

      res.redirect('/applicants/' + applicant._id);
    }
  });
}