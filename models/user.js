var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

// set up a mongoose model and pass it using module.exports
//module.exports = mongoose.model('User', new Schema({ 
var UserSchema = new Schema({
    name: String, 
    password: String, 
    type: String,
    refid: String,
    email: String 
});



UserSchema
	.virtual('userPassword')
	.set(function(password) {
    	this._password = password;
    	this.salt = this.makeSalt();
    	this.hashedPassword = this.encryptPassword(password);
  	})
  	.get(function() {
    	return this._password;
  	});

var encryptPassword = function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }


  module.exports = mongoose.model('User',UserSchema);