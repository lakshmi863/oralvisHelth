import StorageService from "../config/storageService.js";

export default class ScanController {
  constructor(scanModel) {
    this.scanModel = scanModel;
    this.storageService = new StorageService(); // ✅ use your unified storage service
  }

  uploadScan = async (req, res) => {
    try {
      const { patientName, patientId, scanType, region } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // ✅ Upload using the selected provider (Cloudinary or Azure Storage)
      const fileUrl = await this.storageService.upload(file);

      const uploadDate = new Date().toISOString();

      // ✅ Save scan details in DB
      await this.scanModel.insertScan(
        patientName,
        patientId,
        scanType,
        region,
        fileUrl,
        uploadDate
      );

      res.json({ message: "Scan uploaded successfully", fileUrl });
    } catch (err) {
      console.error("Upload error:", err.message);
      res
        .status(500)
        .json({ error: "Upload failed", details: err.message });
    }
  };

  getScans = async (req, res) => {
    try {
      const scans = await this.scanModel.getAllScans();
      res.json(scans);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch scans", details: err.message });
    }
  };
}
