import { Request, Response } from "express";
import { User } from "../models/user";
import { Flight } from "../models/flights";

const getAllFlightsAdded = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = req.user?._id

        if(!user){
            return res.json("no userId found")
        }


        const flights = await Flight.find({userId : user})

        return res.json(flights)


    } catch (error: any) {
        console.log("error occured in getallflights added", error.message)
        return res.status(400).json("error occured")
    }
}

const addFlights = async (req: Request, res: Response): Promise<any> => {
    try {

        const user = req.user

        const { flightName, flightNumber, origin, destination, price, flightTakeOffDate,
            capacity, airline, classes, seatsAvailable } = req.body


        if (user?.role !== "admin") {
            return res.json("unauthorized")
        }

        const flightExists = await Flight.findOne({ flightName })

        if (flightExists) {
            return res.json("flight already exists")
        }


        const newFlight = new Flight({
            flightName,
            flightNumber,
            origin,
            destination,
            price,
            flightTakeOffDate,
            capacity,
            airline, classes,
            seatsAvailable,
            userId: user._id
        })

        await newFlight.save();

        return res.json({
            msg: "flight added",
            flight: {
                flightName,
                flightNumber,
                origin,
                destination,
                price,
                flightTakeOffDate,
                capacity,
                airline, classes,
                seatsAvailable,
                userId: user._id
            }
        })

    } catch (error: any) {
        console.log("error occured in addFlights ", error.message)
        return res.status(400).json("error occured")
    }
}

const updateFlights = async (req: Request, res: Response): Promise<any> => {
    try {
        const { flightName, flightNumber, origin, destination, price, flightTakeOffDate,
            capacity, airline, classes, seatsAvailable } = req.body

        const userId = req.params.userId

        const flightUpdate = await Flight.findById({ userId: userId })

        if(!flightUpdate){
            return res.json("no user found")
        }

        flightUpdate.flightName = flightName ||  flightUpdate.flightName
        flightUpdate.flightNumber = flightNumber ||  flightUpdate.flightNumber
        flightUpdate.origin = origin ||   flightUpdate.origin
        flightUpdate.destination = destination ||   flightUpdate.destination
        flightUpdate.price = price ||  flightUpdate.price
        flightUpdate.flightTakeOffDate = flightTakeOffDate ||   flightUpdate.flightTakeOffDate
        flightUpdate.airline = airline ||  flightUpdate.airline
        flightUpdate.classes = classes ||   flightUpdate.classes
        flightUpdate.seatsAvailable = seatsAvailable ||   flightUpdate.seatsAvailable

        await flightUpdate.save()

        return res.json({
            msg : "updated" ,
            flightUpdate : flightUpdate
        })

    } catch (error: any) {
        console.log("error occured in updateFlights ", error.message)
        return res.status(400).json("error occured")
    }
}

const deleteFlights = async (req: Request, res: Response): Promise<any> => {
    try {
        const {flightName , flightNumber} = req.body

        const user = req.user

        const flightsToDelete = await Flight.findOne({
            flightName : flightName ,
            flightNumber : flightNumber,
            userId : user?._id
        })


        if(!flightsToDelete){
            return res.json("no flightname or flight Number found")
        }

        await Flight.findByIdAndDelete(flightsToDelete._id)

        return res.json("deleted")


    } catch (error: any) {
        console.log("error occured in deleteFlights ", error.message)
        return res.status(400).json("error occured")
    }
}

export { getAllFlightsAdded, updateFlights, deleteFlights, addFlights }