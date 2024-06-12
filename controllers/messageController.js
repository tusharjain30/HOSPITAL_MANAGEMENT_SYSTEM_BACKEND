import Message from "../models/messageSchema.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

const sendMessage = catchAsyncErrors(async(req, res, next) => {
    const {firstName, lastName, email, number, message} = req.body;

    if(!firstName || !lastName || !email || !number || !message){
        return next(new ErrorHandler("Please fill full form", 400));
    }

    await Message.create({firstName, lastName, email, number, message});
    return res.status(201).json({success: true, message: "Message send successfully"})
})


const getAllMessages = catchAsyncErrors(async(req, res) => {

    const {role} = req.user

    if(role != "Admin"){
        return next(new ErrorHandler("Only Admin allowed to this resource!"))
    }

    let message = await Message.find()
    res.status(200).json({success: true, message})
})

export {sendMessage, getAllMessages}