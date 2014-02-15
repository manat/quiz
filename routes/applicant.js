
var Applicant = require('../models/applicant.js');

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
  // res.send('You sent the name: ' + req.body.fullname);
  var applicant = new Applicant({ 
    fullname: req.body.fullname, 
    position: req.body.position,
    notes: req.body.notes
  });

  applicant.save(function (error) {
    console.log('fsdfd')
    if (error) {
      console.log(error);
      console.log("Failed to save this applicant. " + applicant);
    }
  });

  res.redirect('/questions')
}