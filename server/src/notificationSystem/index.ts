import ampq from "amqplib/callback_api"
import { emailService } from "../config/emailService"

const AddBookingQueue = 'Booking_queue'

async function sendToQueue(queueName: string, data: any) {
    try {
        ampq.connect("ampq://localhost", function (error0, connection) {
            if (error0) {
                throw error0
            }

            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1
                }
                const queue = queueName

                channel.assertQueue(queue, {
                    durable: false
                })
                let messageContent
                if (typeof data == 'object') {
                    messageContent = JSON.stringify(data)
                } else {
                    messageContent = data
                }
                channel.sendToQueue(queue, Buffer.from(messageContent))

                console.log("data : ", data)
            })
        })
    } catch (error: any) {
        console.log("error in connectQueue", error.message)
        return
    }
}


async function recieveQueue() {
    try {
        ampq.connect("ampq://localhost", function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1
                }

                const queue = AddBookingQueue



                channel.assertQueue(queue, {
                    durable: false
                })

                channel.consume(queue, function (msg) {
                    if (msg != null) {
                        try {

                            const data = JSON.parse(msg.content.toString())

                            processQueueEmail(queue, data)

                            console.log(data)

                            channel.ack(msg)
                        } catch (error) {
                            console.log("error in recieve queue")
                        }
                    }
                })
            })
        })
    } catch (error: any) {
        console.log("error in recieve queue", error.message)
        return
    }
}


async function connectBookingQueue(data: any) {
    return sendToQueue(AddBookingQueue, data)
}


async function processQueueEmail(queueName: string, data: any) {
    try {
        switch (queueName) {
            case 'AddBookingQueue':
                await emailService(
                    data.email,
                    "Flight Booking Confirmed",
                    generateBookingEmail(data)
                )
        }
    } catch (error) {

    }
}

async function generateBookingEmail(data: any) {
    return `
        Hello ${data.username}

        Your flight booking has been confirmed!

    Booking Details:
    - Flight: ${data.airline} from ${data.origin} to ${data.destination}
    - Date: ${new Date(data.bookingDate).toLocaleDateString()}
    - SeatsBooked : ${data.seatsBooked}
    - Class: ${data.classes}
    - Total Price: $${data.bookedPrice}

    Thank you for choosing our service.
    `
}

export { sendToQueue, recieveQueue, AddBookingQueue, connectBookingQueue }