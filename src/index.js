import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comment.js";
import videoRoutes from "./routes/video.js";


const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log(error);
  }
};


const app = express();
dotenv.config();

connectToDatabase();


app.use(express.json());

const corsOptions = {
  origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
  credentials: true,
};



app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);


//error handler
app.use((error, request, response, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong!";
  return response.status(status).json({
    success: false,
    status,
    message,
  });
});



mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(process.env.PORT || 8000, () => {
    console.log("Connected to Server");
  });
});


