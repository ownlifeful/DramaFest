
//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

let RegistrationModelSchema = new Schema({
    email            : String,
    field11          : String,
    field12          : String,
    field21          : String,
    field22          : String,
    field31          : String,
    field32          : String,
    page1_complete   : { type: Boolean, default: false },
    page2_complete   : { type: Boolean, default: false },
    page3_complete   : { type: Boolean, default: false },
    submission_date  : { type: Date, default: Date.now },
});

/*
// Save the new model instance, passing a callback
RegistrationModelSchema.save(function (err) {
  if (err) return handleError(err);
  // saved!
  console.log('SAVED RegistrationModelSchema!');
});
*/

//Export function to create "RegistrationModel" model class
module.exports = mongoose.model('RegistrationModel', RegistrationModelSchema );
