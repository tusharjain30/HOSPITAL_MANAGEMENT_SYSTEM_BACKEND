import jwt from "jsonwebtoken";
import catchAsyncErrors from "./catchAsyncErrors.js";
import { ErrorHandler } from "./errorMiddleware.js";
import User from "../models/userSchema.js";

const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const {patientToken} = req.cookies;

    if (!patientToken) {
        return next(new ErrorHandler("Patient is not Authenticated", 400));
    }

    let decode = jwt.verify(patientToken, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decode.id);
    if (req.user.role !== "Patient") {
        return next(new ErrorHandler(`${req.user.role} is not authorized`, 403))
    }

    next();
})

const isAdminOrDoctorAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const {dashboardToken} = req.cookies;

    if (!dashboardToken) {
        return next(new ErrorHandler("Admin or Doctor is not Authenticated", 400));
    }
    let decode = jwt.verify(dashboardToken, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decode.id);

    next();
})



export { isPatientAuthenticated, isAdminOrDoctorAuthenticated }