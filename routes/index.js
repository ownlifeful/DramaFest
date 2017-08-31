const express = require('express');
const passport = require('passport');
const router = express.Router();
const bodyParser = require('body-parser');
const stringify = require('json-stringify-safe');

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL:
    process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
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
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/', (req,res,next) => {
  const page = {
    field11: 'foo',
    field12: 'bar'
  }
  res.render('index',{ page: page });
});

// router.get(/regexp/);
// This is a desirable function signature.

router.get('/page1', (req,res,next) => {
    console.log('Hello, Mr. World');


    var sanitized = JSON.parse(stringify(req));


    console.log('In page1: req=[' + sanitized + ']');
    const page = {
      field11: 'apple',
      field12: 'orange'
    }
    res.render('page1', {page: page});
  });

router.get('/page2', (req,res,next) => {
  const page = {
    field21: 'banana',
    field22: 'strawberry'
  }
  res.render('page2', {page: page}); }

);
router.get('/page3', (req,res,next) => { res.render('page3', {page: page}); });

router.post('/page1', urlencodedParser, (req,res,next) => {
  if (!req.body) return res.sendStatus(400);
  console.log('field11:[' + req.body.field11 + ']');
  console.log('field12:[]' + req.body.field12 + ']');
  page = {}
  res.render('page2',{page: page});
});

router.post('/page2',  urlencodedParser, (req,res,next) => {
  if (!req.body) return res.sendStatus(400);
  console.log('field21:[' + req.body.field21 + ']');
  console.log('field22:[]' + req.body.field22 + ']');
  page = {}
  res.render('page3',{page: page});
});

router.post('/page3', urlencodedParser, (req,res,next) => {
  if (!req.body) return res.sendStatus(400);
  console.log('field31:[' + req.body.field31 + ']');
  console.log('field32:[]' + req.body.field32 + ']');
  res.send('Done!');
});


module.exports = router;
