import StorageService from "../config/storageService.js";
import PDFDocument from "pdfkit";

export default class ScanController {
  constructor(scanModel) {
    this.scanModel = scanModel;
    this.storageService = new StorageService();
  }

  // ✅ Upload a scan
  async uploadScan(req, res) {
    try {
      const { patientName, patientId, scanType, region } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Upload to storage
      const uploadResult = await this.storageService.upload(file);

      // ✅ Pick ONE URL (prefer Cloudinary, fallback to Azure)
      const fileUrl = uploadResult.cloudinaryUrl || uploadResult.azureUrl;

      if (!fileUrl) {
        return res.status(500).json({ error: "File upload failed. No URL returned." });
      }

      const uploadDate = new Date().toISOString();

      // Save in DB
      await this.scanModel.insertScan(
        patientName,
        patientId,
        scanType,
        region,
        fileUrl,  // ✅ always string now
        uploadDate
      );

      console.log("📂 Final fileUrl stored in DB:", fileUrl);

      res.json({ message: "Scan uploaded successfully", fileUrl });
    } catch (err) {
      console.error("❌ Upload failed:", err);
      res.status(500).json({ error: "Upload failed", details: err.message });
    }
  }

  // ✅ Fetch all scans
  async getScans(req, res) {
    try {
      const scans = await this.scanModel.getAllScans();
      res.json(scans);
    } catch (err) {
      console.error("❌ Failed to fetch scans:", err);
      res.status(500).json({ error: "Failed to fetch scans", details: err.message });
    }
  }

  // ✅ Generate PDF for a specific scan
  async generatePdf(req, res) {
    try {
      const { id } = req.params;
      const scan = await this.scanModel.getScanById(id);

      if (!scan) {
        return res.status(404).json({ error: "Scan not found" });
      }

      const doc = new PDFDocument();
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=scan-${scan.id}.pdf`
      );
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
        const fileUrl = scan.imageUrl;
        if (fileUrl && fileUrl.startsWith("uploads/")) {
          doc.text("Scan Image:");
          doc.image(`./${fileUrl}`, { fit: [300, 300], align: "center" });
        } else if (fileUrl) {
          const axios = await import("axios");
          const response = await axios.default.get(fileUrl, {
            responseType: "arraybuffer",
          });
          const buffer = Buffer.from(response.data, "binary");
          doc.text("Scan Image:");
          doc.image(buffer, { fit: [300, 300], align: "center" });
        } else {
          doc.text("⚠️ No image available for this scan.");
        }
      } catch (imgErr) {
        doc.text("⚠️ Failed to load image inside PDF, showing URL instead:");
        doc.text(scan.imageUrl || "No URL", {
          link: scan.imageUrl,
          underline: true,
        });
      }

      doc.end();
    } catch (err) {
      console.error("❌ PDF generation error:", err);
      res.status(500).json({ error: "Failed to generate PDF", details: err.message });
    }
  }
}
