var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var parentSchema = new Schema({
  language:   {type: String},
  national_id:      {type: String},
  personal_documents:  {type: Array},
  first_name:   {type: String},
  middle_name: {type: String},
  lastname:   {type: String},
  place_of_birth:      {type: String},
  date_of_birth:  {type: Date},
  religion:   {type: String},
  nationality: {type: String},
  gender:   {type: String},
  addresses:      {type: Array},
  children:  {type: Array},
  roles:   {type: Array},
  social_status: {type: String},
  education_level:   {type: String},
  work:      {type: String},
  family_members_count:  {type: Array},
  phone:   {type: String},
  email: {type: String}
});

var Parent = mongoose.model('Parent', parentSchema);