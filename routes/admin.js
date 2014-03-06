
var User = require('../models/user');
var Question = require('../models/question');

exports.isAuthenticated = function(req, res, next) {
  if (req.user) {
    req.session.returnTo = req.path; 
    next();
  }
  else {
    res.redirect('/admin/login');
  }
};

exports.hasRole = function(role, req, res, next) {
  if (req.user.hasRole(role)) { return next(); }
};

exports.hasRoleAdmin = function(req, res, next) {
  if (req.user.hasRole('admin')) { return next(); }
};

exports.hasRoleContributor = function(req, res, next) {
  if (req.user.hasRole('contributor')) { return next(); }
};

exports.hasRoleAdminOrIsCreator = function(req, res, next) {
  if (req.user.hasRole('admin')) { return next(); }

  Question.findById(req.params.id, function(err, question) {
    if (err) { return next(err); }
    if (question) {
      if ((question.creator.toString() == req.user._id) ||
          (question.updater.toString() == req.user._id)) {
          return next();
      }
    }
  });
};

exports.index = function(req, res, next) {
  res.render('admin/index', {
    canListQuestions: req.user.hasRole('contributor'), 
    canAddQuestions: req.user.hasRole('contributor')
  });
};

/* Users */

exports.users = {}
exports.users.new = function(req, res, next) {
  res.render('admin/users/new');
};

exports.users.create = function(req, res, next) {
  var user = new User({ 
    username: req.body.username, 
    email: req.body.email,
    password: req.body.password, 
    created_at: new Date,
    roles: ['contributor'] // TODO : hard code for now! 
  });

  // encrypt password
  user.password = user.generateHash(user.password);

  user.save(function(err) {
      if (err) { return next(err); } 

      res.redirect('/admin/login');
  });
};

exports.users.show = function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) { return next(err); } 

    res.send('Thank you, ' + user.username);
  });
};

exports.users.login = function(req, res, next) {
  res.render('admin/users/sessions/new');
};

/* Questions */

exports.questions = {}
exports.questions.index = function(req, res, next) {
  Question.where('creator').equals(req.user._id)
    .exec(function(err, questions) {
      if (err) { return next(err); } 

      res.render('admin/questions/index', {
      questions: questions
    });
  });
};

exports.questions.show = function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    var md = require('marked');

    if (err) { return next(err); }

    res.render('admin/questions/show', { question: question, md: md });
  });
};

exports.questions.new = function(req, res, next) {
  res.render('admin/questions/new', { 
    question: new Question(),
    action: '/admin/questions/create' });
};

exports.questions.create = function(req, res, next) {
  var question = new Question({ 
    title: req.body.title,
    text: req.body.text, 
    category: req.body.category,
    tags: req.body.tags.split(','),
    point: req.body.point,
    creator: req.user._id,
    updater: req.user._id,
    created_at: new Date
  });

  question.save(function(err) {
      if (err) { return next(err); } 

      res.redirect('/admin/questions/' + question._id);
  });
};

exports.questions.edit = function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if (err) { return next(err); }

    res.render('admin/questions/edit', { 
      question: question, 
      action: '/admin/questions/' + question._id + '/update' });
  });
};

exports.questions.update = function(req, res, next) {
  Question.update({ _id: req.params.id }, { 
    title: req.body.title,
    text: req.body.text, 
    category: req.body.category,
    tags: req.body.tags.split(','),
    point: req.body.point,
    updater: req.user._id,
    updated_at: new Date
  }, function(err, question) {
    if (err) { return next(err); } 

    res.redirect('/admin/questions/' + req.params.id);
  });
};


