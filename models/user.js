// User Model

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var User;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true }, 
    email: { type: String, required: true, unique: true, trim: true }, 
    password: { type: String, required: true }, 
    roles: [String], 
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

// verify role 
userSchema.methods.hasRole = function(role) {
  return (this.roles.indexOf(role) > -1);
}

User = mongoose.model('User', userSchema);

 // validate roles
User.schema.path('roles').validate(function (value) {
    return /contributor|admin/i.test(value);
}, 'Invalid role.');

// exports User
module.exports = User
