// User Model

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, trim: true }, 
    email: { type: String, required: true, trim: true }, 
    password: { type: String, required: true, trim: true }, 
    created_at: Date, 
    updated_at: { type: Date, default: Date.now }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);
