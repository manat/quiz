
var Exam = require('../models/exam');

exports.show = function(req, res) {
  Exam.findById(req.params.id, function(err, exam) {
    if (err) {
      console.log('[ERROR]: ' + Date.now + '\n' + err);
      res.redirect('500'); // TODO
    }

    res.render('exams/show', { 
      exam: exam,
      questionAmount: exam.items.length, 
      nextLink: '/exams/' + exam._id + '/questions/' + exam.items[0]._id
    });  
  });
}