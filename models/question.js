// Question Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Question', {
    text: String, 
    tags: [String], 
    point: Number, 
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' }, 
    choices : [{ type: Schema.Types.ObjectId, ref: 'Choice' }], 
    created_at: Date, 
    updated_at: { type: Date, default: Date.now }
});
