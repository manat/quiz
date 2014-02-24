
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

exports.isAuthenticated = function(req, res, next) {
  if (req.user) {
    next();
  }
  else {
    res.redirect('/admin/login');
  }
};

exports.users = {}
exports.users.new = function(req, res, next) {
  res.render('admin/users/new');
};

exports.users.create = function(req, res, next) {
  var user = new User({ 
    username: req.body.username, 
    email: req.body.email,
    password: req.body.password, 
    created_at: new Date
  });

  // encrypt password
  user.password = user.generateHash(user.password);

  user.save(function(err) {
      if (err) { return next(err); } 

      res.redirect('/admin/users/' + user._id);
  });
};

exports.users.show = function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) { return next(err); } 

    res.send('Thank you, ' + user.username);
  });
}

exports.users.login = function(req, res, next) {
  res.render('admin/users/sessions/new');
};

exports.questions = {}
exports.questions.show = function(req, res, next) {
  res.send('admin questions show');
};