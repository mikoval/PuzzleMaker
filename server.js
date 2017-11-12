var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'));

// required for passport
if(process.env.REDISTOGO_URL){
     redisUrl = url.parse(process.env.REDISTOGO_URL);
     redisAuth = redisUrl.auth.split(":");
     
     options = {
        host: redisUrl.hostname,
        port: redisUrl.port,
        
        pass: redisAuth[1]
      }
      app.use(session({ store: new RedisStore(options), secret: 'secret'}));
      console.log("production")
}
else{
    options = {}
    app.use(session({ secret:"secret"}));
    console.log("dev")
}

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
