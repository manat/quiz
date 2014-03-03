
module.exports = function(app, passport) {
  var index = require('./routes/index');
  var applicant = require('./routes/applicant');
  var question = require('./routes/question');
  var exam = require('./routes/exam');
  var admin = require('./routes/admin');

  // root : make new applicant as a default
  app.get('/', applicant.new);

  // applicant route
  app.get('/applicants/new', applicant.new);
  app.get('/applicants/:id', applicant.show);
  app.post('/applicants', applicant.create);

  // exam route
  app.get('/exams/:id/done', exam.done);
  app.post('/exams/:id/done', exam.done);
  app.get('/exams/:id', exam.show);
  app.get('/exams/:exam_id/questions/:question_id', exam.question.show);
  app.post('/exams/:exam_id/questions/:question_id', exam.question.create);

  // quiestion route
  app.get('/questions', question.list);

  // admin
  app.get('/admin/register', admin.users.new);
  app.post('/admin/register', admin.users.create);
  app.get('/admin/login', admin.users.login);
  app.post('/admin/login', passport.authenticate('local', { successRedirect: '/admin', 
                                                           failureRedirect: '/admin/login' }));
  app.get('/admin/users/:id', admin.users.show);
  
  // every route below '/admin/*'' is now protected
  app.all('/admin/*', admin.isAuthenticated);
  app.all('/admin', admin.isAuthenticated, admin.index);
  app.get('/admin/questions', admin.hasRoleContributor, admin.questions.index);
  app.get('/admin/questions/new', admin.hasRoleContributor, admin.questions.new);
  app.post('/admin/questions/create', admin.hasRoleContributor, admin.questions.create);
  app.get('/admin/questions/show/:id', admin.hasRoleAdminOrIsCreator, admin.questions.show);

}