// Applicant Model

var mongoose = require('mongoose');

module.exports = mongoose.model('Applicant', {
    fullname: String, 
    position: String, 
    notes: String, 
    created_at: { type: Date, default: Date.now }
});
