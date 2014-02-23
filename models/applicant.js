// Applicant Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Applicant', {
    firstname: { type: String, required: true, trim: true }, 
    lastname: { type: String, required: true, trim: true }, 
    position: { type: String, required: true, trim: true }, 
    notes: String, 
    exams: [{ type: Schema.Types.ObjectId, ref: 'Exam' }], 
    created_at: Date, 
    updated_at: { type: Date, default: Date.now }
});
