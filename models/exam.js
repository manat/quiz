// Exam Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Question = require('./question');

module.exports = mongoose.model('Exam', {
    name: String, 
    description: String, 
    questions : [{ type: Schema.Types.ObjectId, ref: 'Question' }], 
    created_at: Date, 
    updated_at: { type: Date, default: Date.now }
});
