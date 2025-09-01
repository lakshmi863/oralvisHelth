import express from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export default function scanRoutes(scanController) {
  const router = express.Router();

  // Upload route
  router.post("/upload", upload.single("file"), (req, res) =>
    scanController.uploadScan(req, res)
  );

  // Fetch all scans
  router.get("/", (req, res) => scanController.getScans(req, res));

  return router;
}
