import express from "express";
const app = express();
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import dbConnect from "./Database/dbConnect.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import messageRouter from "./routes/messageRoute.js";
import userRouter from "./routes/userRoute.js";
import appointmentRouter from "./routes/appointmentRoute.js"

app.use(cookieParser())
app.use(express.json())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))


config({
    path: "./config/config.env"
})

app.use(cors({
    origin: [process.env.FRONT_END_URL, process.env.DASHBOARD_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
}))

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

app.use(express.urlencoded({
    extended: true
}))

dbConnect();
app.use(errorMiddleware)

export default app;