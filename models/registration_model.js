
//Require Mongoose
const mongoose = require('mongoose');
const findOneOrCreate = require('mongoose-find-one-or-create');

//Define a schema
const Schema = mongoose.Schema;

let RegistrationModelSchema = new Schema({
    email            : String,
    field11          : String, // prodname
    field12          : String, // playwrights
    field13          : String, // summary
    field14          : String, // duration
    field21          : String,
    field22          : String,
    field31          : String,
    field32          : String,
    page1_complete   : { type: Boolean, default: false },
    page2_complete   : { type: Boolean, default: false },
    page3_complete   : { type: Boolean, default: false },
    submission_date  : { type: Date, default: Date.now },
});

RegistrationModelSchema.plugin(findOneOrCreate);

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
