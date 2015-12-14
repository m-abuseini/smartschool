var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Bus', new Schema({ 
  language:   String,
  number: String,
  bus_driver: {},
  bus_details: {},
  trips: Array,
  school_id: String,
  location: {},
  email: String
}));



// trips: [
// 	{
// 		trip_id: String,
// 		type: String,
// 		name: String
// 	}
// ]

// location: {
// 		latitude: String,
// 		longitude: String
// 	}



// bus_dirver : {
// 	name: "bus driver name",
// 	license: "photo _ URL",
//	age: "22",
//	phone_number : "123214"
//  }



// bus_details : {
// 	maker: "hyundai",
//	model: "bus",
// 	plate_number: "12-34567",
// 	capacity: "30"
//  }	

