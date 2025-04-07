import { Response } from "express"

export const setCookie = async ( res : Response , token : string ) : Promise<any> =>{
    try {
        res.cookie("token" , token , {
            httpOnly : true,
            sameSite : "strict",
            maxAge : 1000 * 60 * 60
        } )
    } catch (error : any) {
        console.log("error in setCookie" , error.message)
        return res.json("error occured")
    }
}

