import express from "express";
import {deleteAppointment, getAllAppointments, getDoctorSelfAppointments, getPatientAppointments, sendAppointment, updateAppointmentStatus} from "../controllers/appointment.Controller.js";
import { isPatientAuthenticated, isAdminOrDoctorAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.route("/post").post(isPatientAuthenticated, sendAppointment)
router.route("/getAllAppointments").get(isAdminOrDoctorAuthenticated, getAllAppointments)
router.route("/getAllPatientAppointments").get(isPatientAuthenticated, getPatientAppointments)
router.route("/updateAppointmentStatus/:id").put(isAdminOrDoctorAuthenticated, updateAppointmentStatus)
router.route("/deleteAppointment/:id").delete(isAdminOrDoctorAuthenticated, deleteAppointment)
router.route("/getDoctorSelfAppointments").get(isAdminOrDoctorAuthenticated, getDoctorSelfAppointments)

export default router;