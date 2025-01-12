const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');

const userSchema = mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique: true
    },
    password:{
        type:String,
    },
    isUserActivated:{
        type:Boolean,
        default: false
    },
    resetToken:{
        type:String,
        default:""
    },
    activationToken:{
         type:String,
         default:""
    },
    activatedAt:{
        type:Date
    }
});


const userModel  = mongoose.model('user', userSchema);

module.exports = userModel;