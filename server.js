var express= require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),

    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),

    configDB = require('./config/database.js');

var db = mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); //get information from html forms

app.set('view-engine', 'ejs');

//required for passport
app.use(session({secret: 'thequickbrownfoxjumpsovertherabbit'}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(port);
console.log('The server is listening on port: ' + port);
