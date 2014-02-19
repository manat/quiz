
var Exam = require('../models/exam');
var renderErrorIfAny = function(err, res) {
  if (err) {
    console.log('[ERROR]: ' + new Date() + '\n' + err);
    res.redirect('500'); // TODO
  }
}

exports.show = function(req, res) {
  Exam.findById(req.params.id, function(err, exam) {
    renderErrorIfAny(err, res);

    res.render('exams/show', { 
      exam: exam,
      questionAmount: exam.items.length, 
      nextLink: '/exams/' + exam._id + '/questions/' + exam.items[0]._id
    });  
  });
}

/**
 * nested resource 
 */

exports.question = {};
exports.question.show = function(req, res) {
  Exam.findById(req.params.exam_id, function(err, exam) {
    renderErrorIfAny(err, res);
    
    var md = require('marked');
    var question;
    var buttonText = 'Next';

    for (var i = 0; i < exam.items.length; i++) {
      if (exam.items[i]._id == req.params.question_id) {
        question = exam.items[i].question[0];
        if ((i + 1) === exam.items.length) {
          buttonText = 'Submit';
        }
      }
    }

    // TODO
    question.text = '# Something\n```javascript\nvar s;\n```';

    res.render('exams/questions/show', { 
      md: md, 
      question: question, 
      buttonText: buttonText
    });  
  });
}

exports.question.create = function(req, res) {
  Exam.findById(req.params.exam_id, function(err, exam) {
    renderErrorIfAny(err, res);
    
    var question;
    var answer = req.body.answer;
    var nextItemId;

    for (var i = 0; i < exam.items.length; i++) {
      if (exam.items[i]._id == req.params.question_id) {
        question = exam.items[i].question[0];
        if ((i + 1) < exam.items.length) {
          nextItemId = exam.items[i + 1]._id;
        }
        
        exam.items[i].answer = req.body.answer;
        exam.save(function(err) {
          renderErrorIfAny(err, res);
          
        });
      }
    }

    res.redirect('/exams/' + exam._id + '/questions/' + nextItemId);
  });
}
