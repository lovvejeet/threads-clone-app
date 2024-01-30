import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: "dkit7rfrz",
  api_key: "249115466588656",
  api_secret: "w34s-SaratnXrJaUTc98Ufu_ZN4",
});
//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () =>
  console.log(`server started at http://localhost:${PORT}`)
);
