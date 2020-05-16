const strategy = require('passport-facebook')
const facebookStrategy = strategy.Strategy
const User = require('../models/user')

module.exports = new facebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.DOMAIN + process.env.FB_CB,
    profileFields: ["name", "email", "id"]
}, async function(accessToken, refreshToken, profile, cb) {
    
    const nameObj = {name: `${profile._json.first_name} ${profile._json.last_name}`, 
        email: profile._json.email}
    const user = await User.findOneOrCreate(nameObj)
    
    cb(null, user)
  })