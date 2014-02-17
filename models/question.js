// Question Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Question', {
    text: String, 
    tags: [String], 
    point: Number, 
    choices : ['Choice'], 
    solution: String,
    created_at: Date, 
    updated_at: { type: Date, default: Date.now }
});
