
var Applicant = require('../models/applicant');
var Exam = require('../models/exam');
var Question = require('../models/question');

/*
 * GET applicants listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

/*
 * POST create an applicant.
 */

exports.create = function(req, res) {
  var applicant = new Applicant({ 
    fullname: req.body.fullname, 
    position: req.body.position,
    notes: req.body.notes
  });

  var question = new Question({
    text: "Sample Question #1", 
    point: 5
  });

  var exam = new Exam({
    name: "Sample Exam #1", 
    questions: [question]
  });

  // See http://mongoosejs.com/docs/populate.html
  exam.save();

  question.exam = exam;
  question.save();

  applicant.save(function (error) {
    console.log('fsdfd')
    if (error) {
      console.log(error);
      console.log("Failed to save this applicant. " + applicant);
    }
  });

  res.redirect('/questions')
}