
var Exam = require('../models/exam');
var renderErrorIfAny = function(err, res) {
  if (err) {
    console.log('[ERROR]: ' + new Date() + '\n' + err);
    res.redirect('500'); // TODO
  }
}
var renderErrorIfNotAuthenticated = function(cookie, res) {
  /* See http://expressjs.com/api.html#res */

  if (!(cookie && cookie.authenticated)) {
      console.log('[ERROR]: Unauthenticated : ' + new Date());
      res.redirect('404'); // TODO
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

exports.done = function(req, res) {
  Exam.findById(req.params.id, function(err, exam) {
    renderErrorIfAny(err, res);

    res.clearCookie(exam.applicant);
    res.render('exams/done');
  });
}

/**
 * nested resource 
 */

exports.question = {};
exports.question.show = function(req, res) {

  Exam.findById(req.params.exam_id, function(err, exam) {
    renderErrorIfAny(err, res);
    renderErrorIfNotAuthenticated(req.signedCookies[exam.applicant], res);
    
    var md = require('marked');
    var question;
    var answer;
    var nextQuestionIds = [];
    var previousQuestionIds = [];

    for (var i = 0, no = 1; i < exam.items.length; i++, no++) {
      if (exam.items[i]._id == req.params.question_id) {
        question = exam.items[i].question[0];
        answer = exam.items[i].answer;

        // TODO
        question.text = '#' + no + '\n```javascript\nvar s;\n```';
        // END TODO
      }
      else if (question) {
        nextQuestionIds.push({ no: no, id: exam.items[i]._id });
      } 
      else {
        previousQuestionIds.push({ no: no, id: exam.items[i]._id });
      }
    }

    res.render('exams/questions/show', { 
      md: md, 
      question: question, 
      answer: answer,
      nextQuestionIds: nextQuestionIds,
      previousQuestionIds: previousQuestionIds
    });  
  });
}

exports.question.create = function(req, res) {
  Exam.findById(req.params.exam_id, function(err, exam) {
    renderErrorIfAny(err, res);
    var answer = req.body.answer;
    var questionId = req.body.submit_id;
    var isNext = (req.body.submit_mode == 'next');
    var isSubmit = (req.body.submit_mode == 'submit');

    if (isSubmit) {
      return res.redirect('/exams/' + exam._id + '/done');
    }

    for (var i = 0; i < exam.items.length; i++) {
      if (exam.items[i]._id == req.params.question_id) {
        if (questionId.length === 0) {
          if (isNext && ((i + 1) < exam.items.length)) {
            questionId = exam.items[i + 1]._id;
          }
          else if (!isNext && ((i - 1) >= 0)) {
            questionId = exam.items[i - 1]._id;
          }
        }
        
        exam.items[i].answer = req.body.answer;
        exam.save(function(err) {
          renderErrorIfAny(err, res);
        });
      }
    }

    res.redirect('/exams/' + exam._id + '/questions/' + questionId);
  });
}
