import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ 
    origin: process.env.CORS_ORIGIN, 
    credentials: true 
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import otpRouter from "./routes/otp.routes.js";
import careTakerRouter from "./routes/careTaker.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import reviewRouter from "./routes/review.routes.js"

app.use("/api/v1/users", userRouter)
// app.use("/api/v1/otp", otpRouter)
app.use("/api/v1/caretakers", careTakerRouter)
app.use("/api/v1/bookings", bookingRouter)
app.use("/api/v1/review", reviewRouter)

app.use(errorHandler); 

export { app }
