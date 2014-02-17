// Applicant Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Applicant', {
    fullname: String, 
    position: String, 
    notes: String, 
    exams: [{ type: Schema.Types.ObjectId, ref: 'Exam' }], 
    created_at: Date, 
    updated_at: { type: Date, default: Date.now }
});
