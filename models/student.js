var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Student', new Schema({ 
  language:   String,
  national_id:  String,
  photo: String,
  personal_documents:  Array,
  first_name:   String,
  middle_name: String,
  last_name:   String,
  place_of_birth:   String,
  date_of_birth:  String,
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
  phone_number:  String,
  email: String,
  device_id: String
}));


// trips: [
//  {
//    trip_id: String,
//    type: String,
//    name: String
//  }
// ]




	// place_of_birth: "amman jordan",
	// date_of_birth:  "new Date",
	// religion:   "1",
	// nationality: "1",
	// gender: "1",
	// address: "5662dc9077f7fbe062d4a280",
	// parents:  [],
	// roles:   ["id_1",'id_2'],
	// order_in_family: "1",
	// health_status: "1",
	// education_status: "1",
	// failure_reasons: "1",
	// financial_aid_type: "1",
	// family_income: "1",
	// relief_card_status: "1",
	// social_status: "1",
	// family_members_count:  "1",
	// school: "school_id_1",
	// class: "class_id_1",
	// section: "section_is_1",
	// educational_documents: ["id_1",'id_2'],
	// phone:   "1",
	// email: "student@zlious.com",
	// device_id: "student-device_id"

// Student.virtual('full_name').get(function(){
// 	return this.first_name +' '+this.lastname;
// });
