const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
mongoose.Promise = global.Promise

const userSchema = new mongoose.Schema({
    username:String, 
    email:String,
    resetPasswordToken:String,
    resetPasswordExpires:Date
})

userSchema.plugin(passportLocalMongoose, {usernameField:'email'})

module.exports = mongoose.model('User', userSchema) 