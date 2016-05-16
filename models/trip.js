var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Trip', new Schema({ 
  language:   String,
  name: String,
  bus: String,
  bus_teacher: String,
  type: String,
  pickup_points: Array,
  drop_points: Array,
  active: Boolean,
  students: Array
}));



// pickup_points,drop_points:[
// 	{
// 		name: String,
// 		pickup_point_id/drop_point_id: String,
// 		latitude : String,
//   	longitude: String
// 	},
// ]


// {
// 	"_id"					:	"value",
//	"name"					: 	"trip 1", 
// 	"language"				:	"langauge_id",
// 	"bus"					:	"bus_id",
// 	"bus_teacher"			:	"teacher_id",
//	"type"					: 	"pickup/drop",
//	"pickup_points"			: 	["pickup_point_id_1","pickup_point_id_2"],
//	"drop_points"			: 	["drop_point_id_1","drop_point_id_2"],
//	"active"				: 	true
// }


// students:[
// 	{
// 		student_id:
// 		first_name:
// 		last_name:
// 		address_id:
// 	},

// ]