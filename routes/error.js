
exports.logError = function(err, req, res, next) {
  console.error('::' + new Date());
  console.error(err.stack);
  next(err);
}

exports.errorHandler = function(err, req, res, next) {
  var status = err.status || 500;
  res.status(status);
  res.render(status, { error: err });
}