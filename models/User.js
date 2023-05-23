const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name:{
        type:String,
        
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
const User =  mongoose.model("user",userSchema);
//User.createIndexes();
module.exports = User;