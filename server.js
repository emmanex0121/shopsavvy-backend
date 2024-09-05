// ./server.js
import express from "express";
import config from "./config.js";
import dbConnection from "./db/dbConnection.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/userRouter.js";
import productsRouter from "./routes/productRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// Use import.meta.url to get the current directory equivalent to __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productsRouter);
app.use("/api", uploadRouter); // Add the upload route

dbConnection();
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
