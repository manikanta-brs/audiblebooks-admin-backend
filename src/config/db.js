// database connection for administration
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection failed:", err));
}

export default connectDB;
