
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
    res.render('applicants/show', { applicant: applicant} );
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

  applicant.save(function(error) {
    if (error) {
      console.log(error);
      console.log("Failed to save this applicant. " + applicant);
    }
    else {
      res.redirect('/applicants/' + applicant._id, applicant);
    }
  });
}