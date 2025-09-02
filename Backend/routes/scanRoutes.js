import express from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export default function scanRoutes(scanController) {
  const router = express.Router();

  // ✅ Upload scan
  router.post("/upload", upload.single("file"), (req, res) =>
    scanController.uploadScan(req, res)
  );

  // ✅ Fetch all scans
  router.get("/", (req, res) => scanController.getScans(req, res));

  // ✅ Generate PDF for a scan
  router.get("/:id/pdf", (req, res) => scanController.generatePdf(req, res));

  return router;
}
