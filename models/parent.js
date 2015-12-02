var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Parent', new Schema({ 
  language:   String,
  national_id:  String,
  personal_documents:  Array,
  first_name:   String,
  middle_name: String,
  lastname:   String,
  place_of_birth:   String,
  date_of_birth:  Date,
  religion:   String,
  nationality: String,
  gender:   String,
  addresses:  Array,
  children: Array,
  roles:  Array,
  social_status: String,
  education_level: String,
  work:   String,
  family_members_count: String,
  phone:  String,
  email: String
}));

//var Parent = mongoose.model('Parent', parentSchema);