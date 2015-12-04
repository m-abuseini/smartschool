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
  address:  String,
  children: Array,
  roles:  Array,
  social_status: String,
  education_level: String,
  work:   String,
  family_members_count: String,
  phone:  String,
  email: String,
  device_id: String
}));


// children:  [{
//       child_id : String,
//       full_name: String,
//       class: String,
//       address: String,
//       schhold_id: String
//     },.....]
//var Parent = mongoose.model('Parent', parentSchema);