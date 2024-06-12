import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First Name must contain At least 3 characters!"]
    },
    lastName: {
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
    nic: {
        type: String,
        required: true,
        minLength: [12, "NIC must contain Exact 12 digits"],
        maxLength: [12, "NIC must contain Exact 12 digits"]
    },
    dob: {
        type: Date,
        required: [true, "DOB is required"]
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    appointment_date: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
    },
    doctor: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    hasVisited: {
        type: Boolean,
        default: false,
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Rejected", "Accepted"],
        default: "Pending",
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;