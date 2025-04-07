import { Request, Response } from "express";
import { FlightBook } from "../models/booking";
import { Flight } from "../models/flights";

export const getAllBooking = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = req.user?._id

        if (!user) {
            return res.json("no userId found")
        }

        const allFlightsBooked = await FlightBook.find({ userId: user })

        return res.json(allFlightsBooked)
    } catch (error: any) {
        console.log("error in get all booking ", error.message)
        return res.status(400).json("error occured")
    }
}

export const addBooking = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = req.user

        const { origin, destination, bookingDate, bookedPrice, classes, airline,
            passengersName, passengerAge, seatsBooked, flightId, passengerNumber } = req.body

        const flight = await Flight.findById({ flightId })

        if (!flight) {
            return res.json("no flight found")
        }

        if (flight.seatsAvailable == 0) {
            return res.json("no seats available")
        }

        const existingPassenger = await FlightBook.findOne({
            flightId: flightId,
            userId: user?._id,
            passengersName: passengersName,
            passengerNumber: passengerNumber
        })

        if (existingPassenger) {
            return res.json("passager boooking is already there")
        }

        if (flight.seatsAvailable - seatsBooked < 0) {
            return res.json({
                msg: "that many seats no avaiable",
                seatsAvailable: flight.seatsAvailable
            })
        }


        if (flight.origin != origin || flight.destination != destination || flight.airline != airline) {
            return res.json("booking details mismatch")
        }

        const newBooking = new FlightBook({
            flightId,
            userId: user?._id,
            origin,
            destination,
            bookingDate: new Date(bookingDate), // Ensure it's a Date object
            bookedPrice,
            classes,
            airline,
            passengersName,
            passengerAge,
            passengerNumber,
            bookingStatus: 'confirmed'
        })

        const saveBooking = await newBooking.save()

        await Flight.findByIdAndUpdate(flightId, { $inc: { seatsAvailable: -seatsBooked } })

        return res.json({
            msg: "added booking",
            booking: saveBooking
        })


    } catch (error: any) {
        console.log("error in get all booking ", error.message)
        return res.status(400).json("error occured")
    }
}


export const updateBooking = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = req.user

        const { origin, destination, bookingDate, bookedPrice, classes, airline,
            passengerName, passengerAge, seatsBooked, flightId, passengerNumber } = req.body

        const flightUpdate = await FlightBook.findById({ flightId, userId: user?._id })

        if (!flightUpdate) {
            return res.json("no flight found")
        }

        flightUpdate.origin = origin || flightUpdate.origin
        flightUpdate.destination = destination || flightUpdate.destination
        flightUpdate.bookingDate = bookingDate || flightUpdate.bookingDate
        flightUpdate.bookedPrice = bookedPrice || flightUpdate.bookedPrice
        flightUpdate.airline = airline || flightUpdate.airline
        flightUpdate.classes = classes || flightUpdate.classes
        flightUpdate.passengerName = passengerName || flightUpdate.passengerName
        flightUpdate.passengerAge = passengerAge || flightUpdate.passengerAge
        flightUpdate.passengerNumber = passengerNumber || flightUpdate.passengerNumber
        
        if(seatsBooked > 0 ){
            if(flightId.seatsAvailable - seatsBooked < 0   ) {
                return res.json(`only ${flightId.seatsAvailable} seats are available`)
            }
        }
        await Flight.findByIdAndUpdate(flightId, { $inc: { seatsAvailable: +seatsBooked } })

        if(seatsBooked < 0 ){
        await Flight.findByIdAndUpdate(flightId, { $inc: { seatsAvailable: -seatsBooked } })

        }


        const updatedBooking = await flightUpdate.save()

        return res.json({
            msg : "updated " ,
            flightBooking : updatedBooking
        })




    } catch (error: any) {
        console.log("error in get all booking ", error.message)
        return res.status(400).json("error occured")
    }
}


export const deleteBooking = async (req: Request, res: Response): Promise<any> => {
    try {
        const {flightId} = req.body

        const userId = req.user?._id


        const findFlight = await FlightBook.findById({
            flightId :flightId,
            userId : userId 
        })

        if(!findFlight){
            return res.json("no flight found ")
        }

        const seatsAdded = Number(findFlight.seatsBooked) || 0 

        const updateSeats = await Flight.findByIdAndUpdate(flightId , {$inc : {seatsAvailable : seatsAdded}} , {new : true})

        const deleteBooking = await FlightBook.findByIdAndDelete(findFlight._id)

        if(!deleteBooking){
            return res.json("failed to delete booking")
        }

        if(!updateSeats){
            return res.json("booking delete but seats in flight not updated ")
        }

        return res.json("deleted booking and updated seats ")


    } catch (error: any) {
        console.log("error in get all booking ", error.message)
        return res.status(400).json("error occured")
    }
}