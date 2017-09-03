const stringify = require('json-stringify-safe');

const RegistrationModel = require('../../models/registration_model');

// functions related to routes

let fields = [
  ['field11','field12'], // 0
  ['field21','field22'], // 1
  ['field31','field32'], // 2
];

function get_errors(field, value) {
  let errors = {}
  if ( /\w/.test(value) ) {
    console.log('Field ' + field + ' is set to:[' + value + ']');
    errors = null;
  } else {
    errors[field] = [];
    errors[field].push('Field cannot be blank.');
    console.log('Field ' + field + ' is blank.');
  }
  console.log('Returning ' + stringify(errors));
  return errors;
}

function get_generator(pagenum) {
  console.log('Generating GET for:' + pagenum);
  let func = function(req,res,next) {
    console.log("In GET /page" + pagenum + ":");
    let username = req.user.displayName;
    console.log('Email:' + username );
    let record = {email: username };
    RegistrationModel.findOneAndUpdate(record, { $set: record }, {new: true, upsert: true}, (err,reg) => {
      if (err) {
        console.log("ERROR Found err=[" + err + "]");
        throw err;
      }
      console.log('reg=' + stringify(reg));
      let page = {current_user: username};
      fields[pagenum - 1].forEach((f) => {
        page[f] = reg[f];
      });
      page = Object.assign({page: page}, {errz: {}});
      console.log('page' + pagenum + '=' + stringify(page));
      res.render('page' + pagenum, page);
    });
  }
  return func;
}


function post_generator(pagenum) {
  console.log('Generating POST for:' + pagenum);
  let func = function(req,res,next) {
    console.log('In POST /page' + pagenum);
    if (!req.body) return res.sendStatus(400);
    let username = req.user.displayName;
    let page = { current_user: username };
    fields[pagenum - 1].forEach((f) => {
      page[f] = req.body[f];
    });
    let errz = fields[pagenum - 1].map((field) => get_errors(field, req.body[field])).filter((x) => {
      return ( x !== null );
    } );
    if ( errz.length > 0 ) {
      console.log('ERRORZ1:' + stringify(errz));
      let xxx = {};
      errz.forEach((e)=>{
        console.log('e=' + stringify(e));
        xxx = Object.assign(xxx,e);
        console.log('xxx=' + stringify(xxx));
      });
      errz = xxx;

      console.log('ERRORZ2:' + stringify(errz));
      let result = { page: page, errz: errz }
      console.log(stringify(result));
      res.render('page' + pagenum, result);
    } else {
      console.log('No errors in POST page' + pagenum );
      page ['page' + pagenum + '_complete' ] = true;
      RegistrationModel.findOneAndUpdate({email: username }, { $set: page }, {new: true, upsert: true}, (err,reg) => {
        if (err) throw err;
        fields[pagenum].forEach((f) => {
          page[f] = reg[f];
        });
        console.log("PAGE" + ( pagenum + 1 ) +"=" + stringify(page));
        res.render('page' + ( pagenum + 1 ), {page: page, errz:{}});
      });
    }
  }
  return func;
}

module.exports.get_generator  = get_generator;
module.exports.post_generator = post_generator;
