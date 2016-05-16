var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('School', new Schema({ 
	language:   String,
	name: String,
	location: {},
	email: String,
	phone_number: String
}));