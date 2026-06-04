// server/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // user exists — just return them
          return done(null, user);
        }

        // new user — create them
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          // google users don't have a password
          passwordHash: 'GOOGLE_AUTH',
          avatar: profile.photos[0]?.value,
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;