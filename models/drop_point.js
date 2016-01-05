var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Drop_point', new Schema({ 
  language:   String,
  student_id: String,
  name: String,
  province_id: String,
  street_name: String,
  building_number: String,
  appartment_number: String,
  latitude : String,
  longitude: String,
  primary: Boolean,
  trip_id: String
}));





// {
// 	name: "home",
// 	province_id: "address_province_id",
// 	street_name: "Qatri ben fujaa",
// 	building_number: "7",
// 	appartment_number: "1",
// 	latitude : "31.978268",
// 	longitude: "35.890762",
// 	primary: true
//  }	
