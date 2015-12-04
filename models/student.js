var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Student', new Schema({ 
  language:   String,
  national_id:  String,
  photo: String,
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
  parents: Array,
  roles:  Array,
  social_status: String,
  order_in_family: String,
  health_status: String,
  education_status: String,
  failure_reasons: String,
  financial_aid_type: String,
  family_income:   String,
  relief_card_status: String,
  family_members_count: String,
  school: String,
  class: String,
  section: String,
  educational_documents: Array,
  phone:  String,
  email: String,
  device_id: String
}));


// Student.virtual('full_name').get(function(){
// 	return this.first_name +' '+this.lastname;
// });
