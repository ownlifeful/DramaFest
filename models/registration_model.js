
//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const RegistrationModelSchema = new Schema({
    email            : String,
    field11          : String,
    field12          : String,
    field21          : String,
    field22          : String,
    field31          : String,
    field32          : String,
    page1_complete   : Boolean,
    page2_complete   : Boolean,
    page3_complete   : Boolean,
    submission_date  : { type: Date, default: Date.now },
});

//Export function to create "RegistrationModel" model class
module.exports = mongoose.model('RegistrationModel', RegistrationModelSchema );
