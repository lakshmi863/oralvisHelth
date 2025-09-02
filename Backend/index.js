import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { initDB } from "./config/db.js";
import UserModel from "./models/UserModel.js";
import ScanModel from "./models/ScanModel.js";
import AuthController from "./controllers/AuthController.js";
import ScanController from "./controllers/ScanController.js";
import authRoutes from "./routes/authRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";

dotenv.config();
console.log("🔐 Loaded JWT_SECRET:", process.env.JWT_SECRET);

const startServer = async () => {
  const app = express();

  // ✅ Allowed origins (frontend + local dev)
  const allowedOrigins = [
    process.env.CLIENT_ORIGIN, // from .env (optional)
    "http://localhost:3000",   // CRA dev
    "https://oralvishelth-care-demo-pbb3.onrender.com", // Render frontend
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.error("❌ Blocked by CORS:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.use(express.json());

  // ✅ Init DB
  const db = await initDB();
  const userModel = new UserModel(db);
  const scanModel = new ScanModel(db);

  await userModel.createTable();
  await scanModel.createTable();

  // ✅ Seed default admin user
  const seedAdmin = async () => {
    const adminEmail = "vasu@gmail.com";
    const existingUser = await userModel.getUserByEmail(adminEmail);

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("vasu", 10);
      await userModel.createUser(adminEmail, hashedPassword, "Dentist");
      console.log("✅ Default admin user created:", adminEmail);
    } else {
      console.log("ℹ️ Default admin user already exists");
    }
  };
  await seedAdmin();

  const authController = new AuthController(userModel);
  const scanController = new ScanController(scanModel);

  // ✅ Routes
  app.use("/api/auth", authRoutes(authController));
  app.use("/api/scans", scanRoutes(scanController));

  // ✅ Global error handler
  app.use((err, req, res, next) => {
    console.error("🔥 Unhandled error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
};

startServer();
