'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();
const bodyParser = require('body-parser');
const stringify = require('json-stringify-safe');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const RegistrationModel = require('../models/registration_model');
const funcs = require('./funcs/funcs.js');


const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL:
  process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

/* home page. */
router.get('/', (req,res,next) => {
  console.log('Hello, Mr. World');
  res.render('index');
});

router.post('/', (req,res,next) => {
  console.log('Hello, Ms. World');
  res.render('index');
});

router.get('/about', (req,res,next) => {
  console.log('About DramaFest was requested.');
  res.render('about');
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

router.get('/page1', ensureLoggedIn, funcs.get_generator(1) );

router.post('/page1', ensureLoggedIn, urlencodedParser, funcs.post_generator(1));

router.get('/page2', ensureLoggedIn, funcs.get_generator(2) );

router.post('/page2', ensureLoggedIn, urlencodedParser, funcs.post_generator(2));

router.get('/page3', ensureLoggedIn, funcs.get_generator(3) );

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
