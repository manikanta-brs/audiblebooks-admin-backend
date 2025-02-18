import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/db.js";
import adminRoutes from "./src/routes/adminRoute.js";
import cors from "cors";

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON request bodies

app.use(express.json());
app.use(cors());
// Routes
app.use("/api/admin", adminRoutes);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
