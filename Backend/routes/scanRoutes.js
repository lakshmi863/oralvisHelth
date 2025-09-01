import express from "express";
import multer from "multer";
import PDFDocument from "pdfkit";

const upload = multer({ dest: "uploads/" });

export default function scanRoutes(scanController) {
  const router = express.Router();

  // Upload
  router.post("/upload", upload.single("file"), (req, res) =>
    scanController.uploadScan(req, res)
  );

  // Fetch all scans
  router.get("/", (req, res) => scanController.getScans(req, res));

  // ✅ Download PDF for a specific scan
  router.get("/:id/pdf", async (req, res) => {
  try {
    const scan = await scanController.getScanById(req.params.id);

    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", `attachment; filename=scan-${scan.id}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("🦷 Dental Scan Report", { align: "center" });
    doc.moveDown();

    // Patient Details
    doc.fontSize(14).text(`Patient Name: ${scan.patientName}`);
    doc.text(`Patient ID: ${scan.patientId}`);
    doc.text(`Scan Type: ${scan.scanType}`);
    doc.text(`Region: ${scan.region}`);
    doc.text(`Upload Date: ${scan.uploadDate}`);
    doc.moveDown();

    // ✅ Try to add image
    try {
      const imageUrl = scan.imageUrl;

      // If your imageUrl is local (e.g., uploads/xyz.png)
      if (imageUrl.startsWith("uploads/")) {
        doc.text("Scan Image:");
        doc.image(imageUrl, {
          fit: [300, 300],
          align: "center",
          valign: "center",
        });
      } else {
        // If it's an online URL → fetch and embed
        const axios = await import("axios");
        const response = await axios.default.get(imageUrl, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data, "binary");

        doc.text("Scan Image:");
        doc.image(buffer, {
          fit: [300, 300],
          align: "center",
          valign: "center",
        });
      }
    } catch (imgErr) {
      doc.text("⚠️ Failed to load image inside PDF, showing URL instead:");
      doc.text(scan.imageUrl, { link: scan.imageUrl, underline: true });
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Failed to generate PDF", details: err.message });
  }
});

  return router;
}
