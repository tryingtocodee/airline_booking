import mongoose from "mongoose"

const flightSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    flightName : {
        type : String ,
        required : true
    },
    flightNumber : {
        type : Number,
        required : true ,
        minlength : 5 ,
        maxlength : 20,
        unique : true
    },
    origin: {
        type : String,
        required : true
    },
    destination :{
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true,
    },
    flightTakeOffDate : {
        type :Date,
        required : true
    } ,
    capacity : {
        type : Number,
        required : true
    },
    airline : {
        type : String,
        required : true,
        enums : ["indigo" , "emirates"]
    },
    classes : {
        type : String,
        required : true,
        enum : ["economy" , "business"]
    },
    willBeDelayed : {
        type : Boolean ,
        default : false 
    },
    noOfHrsDelayed : {
        type : Number ,
    },
    cancelled : {
        type : Boolean,
        default : false
    },
    seatsAvailable : {
        type : Number,
        required : true
    }
}, {timestamps : true})

export const Flight = mongoose.model('Flight' , flightSchema)