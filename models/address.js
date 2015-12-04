var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Address', new Schema({ 
  language:   String,
  country_id:  String,
  city_id:  String,
  pickup_points: Array,
  drop_points: Array
}));


// pickup_point:  [{
//		 name: String,
//       pickup_point_id: String,
//       street_name: String,
//		 primary: boolean
//     },.....]


// drop_points:  [{
//		 name: String,
//       drop_point_id: String,
//		 primary: boolean
//     },.....]




		// {
		// 	name: "home",
		// 	province_id: "address_province_id",
		// 	street_name: "Qatri ben fujaa",
		// 	building_number: "7",
		// 	appartment_number: "1",
		// 	latitude : "31.978268",
		// 	longitude: "35.890762",
		// 	primary: true
	 //    }
//var Address = mongoose.model('Address', Address);