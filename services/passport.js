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
      callbackURL: "/api/auth/google/callback",
      // set proxy to true since Heroku uses a proxy to send out requests
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = await new User({
        googleId: profile.id,
        profilePic: profile.photos[0].value
      }).save();
      done(null, newUser);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookAppId,
      clientSecret: keys.facebookAppSecret,
      callbackURL: "/api/auth/facebook/callback",
      // set proxy to true since Heroku uses a proxy to send out requests
      proxy: true
    },
    async (token, tokenSecret, profile, done) => {
      const existingUser = await User.findOne({ facebookId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = await new User({
        facebookId: profile.id,
        profilePic: `https://graph.facebook.com/${
          profile.id
        }/picture?type=small`
      }).save();
      done(null, newUser);
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.twitterConsumerKey,
      consumerSecret: keys.twitterConsumerSecret,
      callbackURL: "/api/auth/twitter/callback",
      // set proxy to true since Heroku uses a proxy to send out requests
      proxy: true
    },
    async (token, tokenSecret, profile, done) => {
      const existingUser = await User.findOne({ twitterId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = await new User({
        twitterId: profile.id,
        profilePic: profile.photos[0].value
      }).save();
      done(null, newUser);
    }
  )
);
