import { v2 as cloudinary } from "cloudinary";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import path from "path";
import { promises as fs } from "fs";

dotenv.config();

class StorageService {
  constructor() {
    // 🔵 Cloudinary Config
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // 🟣 Azure Config
    const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const sasToken = process.env.AZURE_SAS_TOKEN;
    this.containerName = process.env.AZURE_CONTAINER_NAME;

    const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net?${sasToken}`
    );
    this.containerClient = blobServiceClient.getContainerClient(this.containerName);
  }

  // ✅ Upload file to BOTH Cloudinary + Azure
  async upload(file) {
    let cloudinaryUrl, azureUrl;

    // Upload to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(file.path);
      cloudinaryUrl = result.secure_url;
      console.log("✅ Cloudinary upload:", cloudinaryUrl);
    } catch (err) {
      console.error("❌ Cloudinary upload failed:", err.message);
    }

    // Upload to Azure
    try {
      const blobName = path.basename(file.originalname);
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      const fileBuffer = await fs.readFile(file.path);
      await blockBlobClient.uploadData(fileBuffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      azureUrl = blockBlobClient.url;
      console.log("✅ Azure upload:", azureUrl);
    } catch (err) {
      console.error("❌ Azure upload failed:", err.message);
    }

    // cleanup temp file
    await fs.unlink(file.path);

    return {
      cloudinaryUrl,
      azureUrl,
    };
  }

  // ✅ Delete from BOTH Cloudinary + Azure
  async delete(fileUrls) {
    const { cloudinaryUrl, azureUrl } = fileUrls;

    // Cloudinary
    if (cloudinaryUrl) {
      try {
        const parts = cloudinaryUrl.split("/");
        const fileName = parts.pop().split(".")[0];
        const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
        const publicId = folder ? `${folder}/${fileName}` : fileName;

        await cloudinary.uploader.destroy(publicId);
        console.log("🗑️ Deleted from Cloudinary:", publicId);
      } catch (err) {
        console.error("❌ Cloudinary delete failed:", err.message);
      }
    }

    // Azure
    if (azureUrl) {
      try {
        const blobName = azureUrl.split("/").pop();
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();
        console.log("🗑️ Deleted from Azure:", blobName);
      } catch (err) {
        console.error("❌ Azure delete failed:", err.message);
      }
    }

    return { success: true };
  }
}

export default StorageService;
