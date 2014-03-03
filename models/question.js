// Question Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    title: String, 
    text: { type: String, required: true }, 
    category: { type: String, required: true, lowercase: true, trim: true }, 
    tags: [{ type: String, trim: true }], 
    point: { type: Number, required: true }, 
    choices : ['Choice'], 
    solution: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' }, 
    updater: { type: Schema.Types.ObjectId, ref: 'User' }, 
    created_at: Date, 
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
