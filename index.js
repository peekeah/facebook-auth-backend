const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const routes = require('./routes/userRouter');
const users = require('./schemas/userSchema');

const app = express();
app.use(express.json());


app.use(cors({ 
    credentials: true,
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE'
}));

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});


passport.use(new FacebookStrategy({ 
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'picture.type(large)']
    
}, async(accessToken, refreshToken, profile, done) => {
    
    try {
        let existUser = await users.findOne({
            id: profile.id
        })
    
        if(!existUser) {
            await new users({ ...profile._json, picture: profile.photos[0].value }).save();
        }
    
    } catch (err) {
        console.log(err)        
    }

    existUser = await users.findOne({
        id: profile.id
    })

    return done(null, existUser);
}))

app.use('/', routes);   

// monogdb connection
const PORT = process.env.PORT || 5000;
const URL = process.env.MONGO_URL;

mongoose.connect(URL, () => {
    app.listen(PORT, () => {
        console.log(`server listening on port ${PORT}`);
    });
})