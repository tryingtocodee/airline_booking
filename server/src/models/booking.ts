import mongoose from "mongoose"

const flightBookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight"
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    bookedPrice: {
        type: Number,
        required: true,
    },
    classes: {
        type: String,
        required: true,
        enum: ["economy", "business"]
    },
    airline: {
        type: String,
        required: true,
        enums: ["indigo", "emirates"]
    },
    bookingStatus: {
        type: String,
        enum: ["confirmed", "pending_payment", "cancelled", "completed"],
        default: "pending_payment"
    },


    passengerName: {
        type: String,
        required: true
    },
    passengerAge: {
        type: Number,
        required: true
    },
    seatsBooked : {
        type :Number,
        require : true
    },
    passengerNumber : {
        type : Number ,
        required : true
    }
}, { timestamps: true })

export const FlightBook = mongoose.model('FlightBook', flightBookSchema)