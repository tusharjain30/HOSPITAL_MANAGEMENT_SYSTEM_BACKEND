import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minLength: [3, "First Name must contain At least 3 characters!"]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3, "Last Name must contain At least 3 characters!"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    number: {
        type: String,
        required: true,
        minLength: [10, "Mobile number must contain Exact 10 digits"],
        maxLength: [10, "Mobile number must contain Exact 10 digits"],
    },
    message: {
        type: String,
        required: true,
        minLength: [10, "Message must contain At least 10 characters!"]
    }
})

const Message = mongoose.model("Message", messageSchema);

export default Message;