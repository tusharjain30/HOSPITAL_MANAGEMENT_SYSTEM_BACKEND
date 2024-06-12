import express from "express"
import { getAllMessages, sendMessage } from "../controllers/messageController.js";
import { isAdminOrDoctorAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.route("/send").post(sendMessage);
router.route("/getAllMessages").get(isAdminOrDoctorAuthenticated, getAllMessages);

export default router;