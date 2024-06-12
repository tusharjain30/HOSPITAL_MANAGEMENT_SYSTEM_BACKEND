import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js"
import Appointment from "../models/appointmentSchema.js";
import User from "../models/userSchema.js";

const sendAppointment = catchAsyncErrors(async (req, res, next) => {

    const { firstName, lastName, email, number, nic, dob, gender, appointment_date, department, doctor_firstName, doctor_lastName, hasVisited, address } = req.body

    if (!firstName || !lastName || !email || !number || !nic || !dob || !gender || !appointment_date || !department || !doctor_firstName || !doctor_lastName || !address){
        return next(new ErrorHandler("Please fill full form", 400));
    }

    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department
    })

    if (isConflict.length === 0) {
        return next(new ErrorHandler("Doctor not found", 404))
    }

    if (isConflict.length > 1) {
        return next(new ErrorHandler("Please contact through email or phone", 400))
    }

    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;

    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        number,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientId
    })

    return res.status(200).json({success: true, appointment, message: "Appointment send successfully!"})
})

const getAllAppointments = catchAsyncErrors(async(req, res) => {

    const {role} = req.user

    if(role != "Admin"){
        return next(new ErrorHandler("Only Admin allowed to this resource!"))
    }


    const appointments = await Appointment.find()
    res.status(200).json({
        success: true,
        appointments
    })
});

const updateAppointmentStatus = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params;

    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment not found", 404));
    }

    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({success: true, message: "Appointment status updated!", appointment})
})

const deleteAppointment = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params;
    
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment not found", 404));
    }

    await appointment.deleteOne();
    return res.status(200).json({success: true, message: "Appointment delete successfully"});
})

const getPatientAppointments = catchAsyncErrors(async(req, res, next) => {
    const patientId = req.user._id;

    const appointments = await Appointment.find({patientId: patientId})
    if(!appointments){
        return next(new ErrorHandler("Appointments not found", 400));
    }

    return res.status(200).json({success: true, appointments})
})

const getDoctorSelfAppointments = catchAsyncErrors(async(req, res, next) => {
    const doctorId = req.user._id
    const appointments = await Appointment.find({doctorId})
    if(!appointments){
        return next(new ErrorHandler("Appointments not found", 400));
    }
    return res.status(200).json({success: true, appointments})
})

export {sendAppointment, getAllAppointments, updateAppointmentStatus, deleteAppointment, getPatientAppointments, getDoctorSelfAppointments};