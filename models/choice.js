// Exam Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Choice', {
    text: String, 
    correct: { type: Boolean, default: false }, 
    question : { type: Schema.Types.ObjectId, ref: 'Question' }, 
});
