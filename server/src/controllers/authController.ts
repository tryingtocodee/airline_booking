import { Request, Response } from "express"
import { User } from "../models/user";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { setCookie } from "../utils/setCookie";

const secret ="1234"


export const signup = async(req : Request , res : Response) : Promise<any> =>{

    try {
        const {username , email , password , role } = req.body;

        const user = await User.findOne({email})

        if(user){
            return res.json("user already exists")
        }

        const token = jwt.sign({email} , secret! , {expiresIn : "1h"})

        const hashedPassword = await bcrypt.hash(password , 10 )

        setCookie(res , token)
        
        const newUser = new User({
            username ,
            email ,
            password : hashedPassword ,
            role
        })
        await newUser.save()

        return res.json({
           msg : " new user created "

        
    })
    } catch (error : any) {

        console.log("error occured in signup " , error.message)

        return res.status(400).json("error occured")

    }

}


export const login = async(req : Request , res : Response) : Promise<any> =>{

    try {
      const {email , password} = req.body

      const user = await User.findOne({email})

      if(!user){
        return res.json("no user found")
      }

        const token = jwt.sign({email} , secret! , {expiresIn : "1h"})

        const verifyPassword = await bcrypt.compare(password , user.password)

        if(!verifyPassword){
            return res.json("incorrect password")
        }
        
      setCookie(res , token)

      return res.json({
        msg : "logged in " ,
        user : {
            email : user.email,
            username : user.username ,
            id : user._id
        }
      })
    } catch (error : any) {

        console.log("error occured in login " , error.message)

        return res.status(400).json("error occured")

    }

}



export const logout = async(req : Request , res : Response) : Promise<any> =>{

    try {
        const token = req.cookies.token

        if(!token){
            return res.json("no token found")
        }

        res.clearCookie("token")

        return res.json("user logged out")

    } catch (error : any) {

        console.log("error occured in logout " , error.message)

        return res.status(400).json("error occured")

    }

}



export const update = async(req : Request , res : Response) : Promise<any> =>{

    try {
        const {username , email , password} = req.body

        const userId = req.user


        const user = await User.findById(userId)

        if(!user){
            return res.json("no user found")
        }

        user.email = email || user.email
        user.username = username || user.username
        
        if(password){
            const hashedPassword = await bcrypt.hash(password , 10)
            user.password = hashedPassword 
        }

        await user.save()

       
        return res.json({
            msg : "user updated" ,
            user : {
                username : user.username,
                email : user.email
            }
        })

    } catch (error : any) {

        console.log("error occured in update " , error.message)

        return res.status(400).json("error occured")

    }

}



export const deleteUser = async(req : Request , res : Response) : Promise<any> =>{

    try {
        const userId = req.user?._id

        const user = await User.findByIdAndDelete({userId})

        if(!user){
            return res.json("no user found")
        }

        return res.json("user deleted")



    } catch (error : any) {

        console.log("error occured in delete " , error.message)

        return res.status(400).json("error occured")

    }

}


