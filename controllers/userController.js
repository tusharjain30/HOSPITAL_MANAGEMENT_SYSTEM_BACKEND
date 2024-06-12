import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/userSchema.js";
import generateToken from "../utills/jwtToken.js";
import cloudinary from "cloudinary"

const Register = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, number, nic, dob, gender, password } = req.body;

    if (!firstName || !lastName || !email || !number || !nic || !dob || !gender || !password ) {
        return next(new ErrorHandler("Please fill full form", 400));
    }

    let user = await User.findOne({ email })
    if (user) {
        return next(new ErrorHandler("User already exist", 400));
    }

    user = await User.create({ firstName, lastName, email, number, nic, dob, gender, password, role: "Patient" })
    generateToken(user, 201, `${user.role} Register Successfully!`, res)
})


const Login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please fill full form", 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password or ConfirmPassword do not match", 400))
    }

    let user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 400))
    }

    let isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid Email or Password", 400))
    }

    if (role !== user.role) {
        return next(new ErrorHandler("Invalid Email or Password", 400))
    }

    generateToken(user, 200, `${user.role} LoggedIn Successfully!`, res)
})

const addNewAdmin = catchAsyncErrors(async (req, res, next) => {

    const { role } = req.user

    if (role != "Admin") {
        return next(new ErrorHandler("Only Admin allowed to this resource!"))
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Admin avatar is required!"))
    }

    const { adminAvatar } = req.files
    const allowedFormats = ["image.png", "image/jpeg", "image/jpg", "image/webp"]
    if (!allowedFormats.includes(adminAvatar.mimetype)) {
        return next(new ErrorHandler("Invalid file format, please provide PNG, JPG and WEBP format type", 400));
    }

    const { firstName, lastName, email, number, nic, dob, gender, password } = req.body;

    if (!firstName || !lastName || !email || !number || !nic || !dob || !gender || !password) {
        return next(new ErrorHandler("Please fill full form", 400));
    }


    const cloudinaryResponse = await cloudinary.uploader.upload(adminAvatar.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log("Cloudinary Error: ", cloudinary.error || "Unknown cloudinary error");
    }

    let user = await User.findOne({ email });

    if (user) {
        return next(new ErrorHandler(`${user.role} with this email already exist`));
    }

    await User.create({
        firstName, lastName, email, number, nic, dob, gender, password, role: "Admin",
        adminAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    })

    return res.status(201).json({ success: true, message: "New admin registered successfully" });
})

const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({ success: true, doctors });
})

const getUserDetails = catchAsyncErrors(async (req, res) => {
    const user = req.user;
    res.status(200).json({ success: true, user });
});

const logoutPatient = catchAsyncErrors(async (req, res) => {
    res.status(200).cookie("patientToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }).json({
        success: true,
        message: "User logged out successfully"
    })
});


const logoutDoctorOrAdmin = catchAsyncErrors(async (req, res) => {
    res.status(200).cookie("dashboardToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }).json({
        success: true,
        message: "Logged out successfully!"
    })
});

const addNewDoctor = catchAsyncErrors(async (req, res, next) => {

    const { role } = req.user

    if (role != "Admin") {
        return next(new ErrorHandler("Only Admin allowed to this resource!"))
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar is required", 400));
    }

    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("Invalid file format, please provide PNG, JPG and WEBP format type", 400));
    }

    const { firstName, lastName, email, number, nic, dob, gender, password, doctorDepartment } = req.body;

    if (!firstName || !lastName || !email || !number || !nic || !dob || !gender || !password || !doctorDepartment) {
        return next(new ErrorHandler("Please fill full form", 400));
    }

    let isRegistered = await User.findOne({ email });

    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} is already registered with this email`));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log("Cloudinary Error: ", cloudinary.error || "Unknown cloudinary error");
    }

    const doctor = await User.create({
        firstName, lastName, email, number, nic, dob, gender, password, doctorDepartment, role: "Doctor",
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    })

    res.status(201).json({
        success: true,
        message: "Docter successfully registered",
        doctor,
    })
})

export { Register, Login, addNewAdmin, getAllDoctors, getUserDetails, logoutPatient, logoutDoctorOrAdmin, addNewDoctor };