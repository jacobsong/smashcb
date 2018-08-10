const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const keys = require("../config/keys");
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ userId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = await new User({ userId: profile.id }).save();
      done(null, newUser);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientId: keys.facebookAppId,
      clientSecret: keys.facebookAppSecret,
      callbackURL: "/auth/facebook/callback"
    },
    async (token, tokenSecret, profile, done) => {
      const existingUser = await User.findOne({ userId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = await new User({ userId: profile.id }).save();
      done(null, newUser);
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.twitterConsumerKey,
      consumerSecret: keys.twitterConsumerSecret,
      callbackURL: "/auth/twitter/callback"
    },
    async (token, tokenSecret, profile, done) => {
      const existingUser = await User.findOne({ userId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = await new User({ userId: profile.id }).save();
      done(null, newUser);
    }
  )
);
