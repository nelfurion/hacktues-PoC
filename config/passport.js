var localStrategy = require('passport-local').Strategy;

var User = require('../app/models/user.js');

module.exports = function (passport) {
    // =========================================================================
   // passport session setup ==================================================
   // =========================================================================
   // required for persistent login sessions
   // passport needs ability to serialize and unserialize users out of session

   passport.serializeUser(function (user, done) {
       done(null, user.id);
   });

   passport.deserializeUser(function (id, done) {
       User.findById(id, function (err, user) {
           done(err, user);
       })
   });

   passport.use('local-signup', new localStrategy({
       // by default, local strategy uses username and password, we will override with email
       usernameField: 'email',
       passwordField: 'password',
       passReqToCallback: true // allows us to pass back the entire request to the callback
   }, function (req, email, password, done) {
       //async
       //User.findOne wont fire unless data is sent back
       process.nextTick(function () {
           // find a user whose email is the same as the forms email
           // we are checking to see if the user trying to login already exists
           User.findOne({'local.email': email}, function (err, user) {
               if (err) {
                   return done(err);
               }

               //check to see if there is already a user with that email
               if (user) {
                   return done(null, false, req.flash('signupMessage', 'That email has already been taken.'))
               } else {
                   var newUser = new User();
                   newUser.email = email;
                   newUser.password = newUser.generateHash(password);
                   newUser.userType = 'user';
                   newUser.name = req.body.name;
                   newUser.team = "No team";

                   newUser.save(function (err) {
                       if (err) {
                           throw err;
                       }

                       return done(null, newUser);
                   });
               }
           })
       })
   }));

   passport.use('local-login', new localStrategy({
       usernameField: 'email',
       passwordField: 'password',
       passReqToCallback: true
   },
    function (req, email, password, done) {
        User.findOne({'email': email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if (!user.validatePassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong password.'));
            }
            return done(null, user);
        });
    }))
}
