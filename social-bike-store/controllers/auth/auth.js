var passport = require('passport')
var BasicStrategy = require('passport-http').BasicStrategy
LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/User')

// Authorization for API using Local Strategy
passport.use(new LocalStrategy({
        usernameField:'email'
    },
    function(username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.isValidPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
  ));