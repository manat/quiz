
var Exam = require('../models/exam');
var isAuthenticated = function(cookie) {
  return (cookie && cookie.authenticated);
};

exports.show = function(req, res, next) {
  Exam.findById(req.params.id, function(err, exam) {
    if (err) { return next(err); } 

    var cookieCounter = exam.applicant + '_counter';
    var counter = req.signedCookies[cookieCounter];

    if (!counter) {
      res.cookie(cookieCounter, (90 * 60), { 
        signed: true, 
        httpOnly: true, 
        maxAge: new Date(Date.now() + (90 * 60) + 60)
      });
    }

    res.render('exams/show', { 
      exam: exam,
      questionAmount: exam.items.length, 
      nextLink: '/exams/' + exam._id + '/questions/' + exam.items[0]._id
    });  
  });
}

exports.done = function(req, res, next) {
  Exam.findById(req.params.id, function(err, exam) {
    if (err) { return next(err); } 

    res.clearCookie(exam.applicant);
    res.render('exams/done');
  });
}

/**
 * nested resource 
 */

exports.question = {};
exports.question.show = function(req, res, next) {
  Exam.findById(req.params.exam_id, function(err, exam) {
    if (err) { return next(error) };

    var md = require('marked');
    var question;
    var answer;
    var nextQuestionIds = [];
    var previousQuestionIds = [];
    var cookie = req.signedCookies[exam.applicant];
    var cookieCounter = exam.applicant + '_counter';
    var counter = req.signedCookies[cookieCounter];

    if (!isAuthenticated(cookie)) { 
      var error = new Error('Unauthenticated User');
      error.status = '401';
      return next(error); 
    };

    for (var i = 0, no = 1; i < exam.items.length; i++, no++) {
      if (exam.items[i]._id == req.params.question_id) {
        question = exam.items[i].question[0];
        answer = exam.items[i].answer;
        question.no = no;
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
      question_count: exam.items.length,
      counter: counter, 
      nextQuestionIds: nextQuestionIds,
      previousQuestionIds: previousQuestionIds
    });  
  });
}

exports.question.create = function(req, res, next) {
  Exam.findById(req.params.exam_id, function(err, exam) {
    if (err) { return next(error) };

    var answer = req.body.answer;
    var questionId = req.body.submit_id;
    var isNext = (req.body.submit_mode == 'next');
    var isSubmit = (req.body.submit_mode == 'submit');
    var cookie = req.signedCookies[exam.applicant];
    var cookieCounter = exam.applicant + '_counter';
    var counterByCookie = req.signedCookies[cookieCounter];
    var counter = parseInt(req.body.counter);

    if ((counter - counterByCookie) > 30) {
      var error = new Error('Time Counter is tampered!');
      error.status = '500';
      return next(error); 
    }

    if (!isAuthenticated(cookie)) { 
      var error = new Error('Unauthenticated User');
      error.status = '401';
      return next(error); 
    };

    res.cookie(cookieCounter, counter, { 
      signed: true, 
      httpOnly: true, 
      maxAge: new Date(Date.now() + counter)
    });

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
          if (err) { return next(error) };
        });
      }
    }

    res.redirect('/exams/' + exam._id + '/questions/' + questionId);
  });
}
