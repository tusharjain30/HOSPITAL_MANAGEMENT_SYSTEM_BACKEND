import express from "express";
import {Register, Login, addNewAdmin, getAllDoctors, getUserDetails, logoutPatient, logoutDoctorOrAdmin, addNewDoctor} from "../controllers/userController.js";
import { isPatientAuthenticated, isAdminOrDoctorAuthenticated } from "../middlewares/auth.js";
const router = express.Router();


router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/admin/addNewAdmin").post(isAdminOrDoctorAuthenticated, addNewAdmin);
router.route("/getAllDoctors").get(isAdminOrDoctorAuthenticated, getAllDoctors);
router.route("/patient/me").get(isPatientAuthenticated, getUserDetails);
router.route("/adminOrDoctor/me").get(isAdminOrDoctorAuthenticated, getUserDetails);
router.route("/adminORDoctor/logout").get(isAdminOrDoctorAuthenticated, logoutDoctorOrAdmin);
router.route("/patient/logout").get(isPatientAuthenticated, logoutPatient);
router.route("/doctor/addNew").post(isAdminOrDoctorAuthenticated, addNewDoctor);

export default router;