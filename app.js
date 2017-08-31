const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const mime = require('mime-types');
const path = require('path');
const stringify = require('json-stringify-safe');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');


// read configuration parameters
const readConfig = require('./readConfig')
const port = readConfig.port();
const hostName = readConfig.hostName();

dotenv.load();


const app = express();
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

const routes = require('./routes/index');
const user = require('./routes/user');

// This will configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});





app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'CD5fEyBbxCNcdVzW79QbJ3hV26veaZkhHSYtKkWFi6KnBdu_qw4SRGSP4VlMz2Ai', // 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// Handle auth failure error messages
app.use(function(req, res, next) {
 if (req && req.query && req.query.error) {
   req.flash("error", req.query.error);
 }
 if (req && req.query && req.query.error_description) {
   req.flash("error_description", req.query.error_description);
 }
 next();
});

// Check logged in
app.use(function(req, res, next) {
  res.locals.loggedIn = false;
  if (req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }
  next();
});

app.use('/', routes);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'Error Title'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get('/', (req,res,next) => {
  const page = {
    field11: 'foo',
    field12: 'bar'
  }
  res.render('index',{ page: page });
});

// app.get(/regexp/);
// This is a desirable function signature.

app.get('/page1', (req,res,next) => {
    console.log('Hello, Mr. World');


    var sanitized = JSON.parse(stringify(req));


    console.log('In page1: req=[' + sanitized + ']');
    const page = {
      field11: 'apple',
      field12: 'orange'
    }
    res.render('page1', {page: page});
  });

app.get('/page2', (req,res,next) => {
  const page = {
    field21: 'banana',
    field22: 'strawberry'
  }
  res.render('page2', {page: page}); }

);
app.get('/page3', (req,res,next) => { res.render('page3', {page: page}); });

app.post('/page1', urlencodedParser, (req,res,next) => {
  if (!req.body) return res.sendStatus(400);
  console.log('field11:[' + req.body.field11 + ']');
  console.log('field12:[]' + req.body.field12 + ']');
  page = {}
  res.render('page2',{page: page});
});

app.post('/page2',  urlencodedParser, (req,res,next) => {
  if (!req.body) return res.sendStatus(400);
  console.log('field21:[' + req.body.field21 + ']');
  console.log('field22:[]' + req.body.field22 + ']');
  page = {}
  res.render('page3',{page: page});
});

app.post('/page3', urlencodedParser, (req,res,next) => {
  if (!req.body) return res.sendStatus(400);
  console.log('field31:[' + req.body.field31 + ']');
  console.log('field32:[]' + req.body.field32 + ']');
  res.send('Done!');
});



module.exports = app;

app.listen(port, () => {
  console.log("Listening on port:" + port);
});
