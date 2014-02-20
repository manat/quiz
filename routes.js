
module.exports = function(app) {
  var index = require('./routes/index');
  var applicant = require('./routes/applicant');
  var question = require('./routes/question');
  var exam = require('./routes/exam');

  // root
  app.get('/', index.show);

  // applicant route
  app.get('/applicants/new', applicant.new);
  app.get('/applicants/:id', applicant.show);
  app.post('/applicants', applicant.create);

  // exam route
  app.get('/exams/:id', exam.show);
  app.get('/exams/:exam_id/questions/:question_id', exam.question.show);
  app.post('/exams/:exam_id/questions/:question_id', exam.question.create);

  // quiestion route
  app.get('/questions', question.list);
}