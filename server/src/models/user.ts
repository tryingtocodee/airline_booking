import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true ,
        min : [8 , "minimum 8 characters required"],
        max : [20 , "maximum 8 characters required"]
    },
    email : {
        type : String,
        required : true ,
        min : [8 , "minimum 8 characters required"],
        max : [20 , "maximum 8 characters required"],
        unique : true
    },
    password : {
        type : String,
        required : true ,
        min : [8 , "minimum 8 characters required"],
        max : [20 , "maximum 8 characters required"],
    },
    role : {
        type : String,
        required : true ,
        enum : ["customer" , "admin" ]
    },
    emailToken : {
        type : String,
        expires : 3600
    },
    isVerified : {
        type : Boolean,
    },
},{timestamps : true})

export const User = mongoose.model('User' , userSchema)