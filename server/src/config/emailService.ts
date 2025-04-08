import nodemailer, { createTransport } from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const emailService = async(mailTo : string | undefined , subject : string , text : any ) => {
    const mailSender = nodemailer.createTransport({
        service : "gmail",
        auth:{
            user : process.env.GMAIL_USER,
            pass : process.env.GMAIL_PASS
        }
    })

    try {
        const res = await mailSender.sendMail({
            from : process.env.GMAIL_USER,
            to : mailTo,
            subject : subject ,
            text : text ,
            html : ""
        })
    } catch (error : any) {
        console.log("error in email service" , error.message)
        return 
    }
}



