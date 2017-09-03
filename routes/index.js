const express = require('express');
const passport = require('passport');
const router = express.Router();
const bodyParser = require('body-parser');
const stringify = require('json-stringify-safe');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const RegistrationModel = require('../models/registration_model');

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

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL:
    process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};



/* GET home page. */
router.get('/', (req,res,next) => {
  console.log('Hello, Mr. World');
  res.render('index');
});

router.get('/login', passport.authenticate('auth0', {
  clientID: env.AUTH0_CLIENT_ID,
  domain: env.AUTH0_DOMAIN,
  redirectUri: env.AUTH0_CALLBACK_URL,
  responseType: 'code',
  audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
  scope: 'openid profile'}),
  function(req, res) {
    res.redirect("/");
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/page1');
  }
);


router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

// create application/json parser
let jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

// router.get(/regexp/);
// This is a desirable function signature.

router.get('/page1', ensureLoggedIn, (req,res,next) => {
  console.log("In GET /page1:");
  let username = req.user.displayName;
  console.log('Email:' + username );
  let record = {email: username };
  RegistrationModel.findOneAndUpdate(record, { $set: record }, {new: true, upsert: true}, (err,reg) => {
    if (err) {
        console.log("ERROR Found err=[" + err + "]");
        throw err;
    }
    console.log(stringify(reg));
    let page = {current_user: username, field11: reg.field11, field12: reg.field12};
    res.render('page1', {page: page, errz: {} });
  });
});

router.post('/page1', ensureLoggedIn, urlencodedParser, (req,res,next) => {
  console.log('In POST /page1');
  if (!req.body) return res.sendStatus(400);
  let username = req.user.displayName;
  let page = { email: username, field11: req.body.field11, field12: req.body.field12 };
  let errz = ['field11', 'field12'].map((field) => get_errors(field, req.body[field])).filter((x) => {
      return ( x !== null );
    } );
  if ( errz ) {

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
    res.render('page1', result);
  } else {
    page.page1_complete = true;
    RegistrationModel.findOneAndUpdate({email: username }, { $set: page }, {new: true, upsert: true}, (err,reg) => {
      if (err) throw err;
      page['field21'] = reg['field21'];
      page['field22'] = reg['field22'];
      console.log("PAGE=" + stringify(page));
      res.render('page2',{page: page});
    });
  }
});

router.get('/page2', ensureLoggedIn, (req,res,next) => {
  console.log("In GET /page2:");
  let username = req.user.displayName;
  console.log('Email:' + username );
  RegistrationModel.findOne({email: username }, (err,reg) => {
    if (err) {
        console.log("ERROR Found err=[" + err + "]");
        throw err;
    }
    let page = {current_user: username, field21: reg.field21, field22: reg.field22};
    res.render('page2', {page: page});
  });
});

router.post('/page2', ensureLoggedIn, urlencodedParser, (req,res,next) => {
  console.log('In POST /page2');
  if (!req.body) return res.sendStatus(400);
  let username = req.user.displayName;
  let page = { email: username, field21: req.body.field21, field22: req.body.field22, page2_complete: true };
  RegistrationModel.findOneAndUpdate({email: username }, { $set: page }, {new: true, upsert: true}, (err,reg) => {
    if (err) throw err;
    page['field31'] = reg['field31'];
    page['field32'] = reg['field32'];
    console.log("PAGE=" + stringify(page));
    res.render('page3', {page: page});
  });
});

router.get('/page3', ensureLoggedIn, (req,res,next) => {
  console.log("In GET /page3:");
  let username = req.user.displayName;
  console.log('Email:' + username );
  RegistrationModel.findOne({email: username }, (err,reg) => {
    if (err) {
        console.log("ERROR Found err=[" + err + "]");
        throw err;
    }
    let page = {current_user: username, field31: reg.field31, field22: reg.field32};
    res.render('page3', {page: page});
  });
});

router.post('/page3', ensureLoggedIn, urlencodedParser, (req,res,next) => {
  console.log('In POST /page3');
  if (!req.body) return res.sendStatus(400);
  console.log('field31:[' + req.body.field31 + ']');
  console.log('field32:[' + req.body.field32 + ']');

  let username = req.user.displayName;
  let page = { email: username, field31: req.body.field31, field32: req.body.field32, page3_complete: true };
  RegistrationModel.findOneAndUpdate({email: username }, { $set: page }, {new: true, upsert: true}, (err,reg) => {
    if (err) throw err;
    console.log("PAGE=" + stringify(page));
    res.send('Done!');
  });
});

module.exports = router;
