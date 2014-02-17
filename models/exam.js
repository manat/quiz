// Exam Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Exam', {
    name: String, 
    description: String, 
    items: [{ question: ['Question'], answer: String }], 
    applicant: { type: Schema.Types.ObjectId, ref: 'Applicant' }, 
    score: Number, 
    created_at: Date, 
    updated_at: { type: Date, default: Date.now }
});
