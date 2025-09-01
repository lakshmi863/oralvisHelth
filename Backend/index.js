import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import UserModel from "./models/UserModel.js";
import ScanModel from "./models/ScanModel.js";
import AuthController from "./controllers/AuthController.js";
import ScanController from "./controllers/ScanController.js";
import authRoutes from "./routes/authRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";

dotenv.config();

const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const db = await initDB();

  const userModel = new UserModel(db);
  const scanModel = new ScanModel(db);
  await userModel.createTable();
  await scanModel.createTable();

  const authController = new AuthController(userModel);
  const scanController = new ScanController(scanModel);

  app.use("/api/auth", authRoutes(authController));
  app.use("/api/scans", scanRoutes(scanController));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
