import StorageService from "../config/storageService.js";

export default class ScanController {
  constructor(scanModel) {
    this.scanModel = scanModel;
    this.storageService = new StorageService();
  }

  uploadScan = async (req, res) => {
    try {
      const { patientName, patientId, scanType, region } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = await this.storageService.upload(file);
      const uploadDate = new Date().toISOString();

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
      res.status(500).json({ error: "Upload failed", details: err.message });
    }
  };

  getScans = async (req, res) => {
    try {
      const scans = await this.scanModel.getAllScans();
      res.json(scans);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch scans", details: err.message });
    }
  };

  getScanById = async (id) => {
    try {
      return await this.scanModel.getScanById(id);
    } catch (err) {
      throw new Error("Failed to fetch scan: " + err.message);
    }
  };
}
