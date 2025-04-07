import { Response , Request , NextFunction } from "express"
import {redis} from "../config/redis"


const ttl = 60 ;
const maxRequests = 10 ;

export const fixedRateLimiter = async (req : Request , res : Response , next : NextFunction) : Promise<any> =>{
    try {
        const ip = req.ip 

        if(!ip){
            console.log(" request ip is undefined . cannot apply rate limit")
            return next() 
        }

        const key = `rate_limit:${ip}`
        console.log(key)

        const currentCount = await redis.incr(key)

        if(currentCount == 1) {
            redis.expire(key , ttl).catch((err)=>{
                console.log("failed to set expiry to requests" , err.message)
            })
        }
        console.log(currentCount)
        if(currentCount  > maxRequests ){
            return res.json("exceeded request limit . try again after 1 min")
        }
        next()
    } catch (error : any) {
        console.log("error in fixedRateLimiter" , error.message)
        return res.json("error occured")
    }
}