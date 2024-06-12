import mongoose from "mongoose";
import { config } from "dotenv";

config({
    path: "../config/config.env"
})

const dbConnect = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI,{
        dbName: "HOSPITAL_MANAGEMENT_SYSTEM"
    });

    if(connection.STATES.connecting){
        console.log("Database is connecting");
    }

    if(connection.STATES.connected){
        console.log("Database is connected");
    }else{
        console.log("Database is not connected");
    }
}

export default dbConnect;