import { useEffect, useState } from "react";
import API from "../api/api";
import "./DentistScans.css"; // ✅ Import styles

export default function DentistScans() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    API.get("/scans").then((res) => setScans(res.data));
  }, []);

  const downloadPDF = async (id) => {
    try {
      const response = await API.get(`/scans/${id}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `scan-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div className="scans-container">
      <h2 className="scans-title">🦷 Patient Scans</h2>

      <div className="scans-grid">
        {scans.map((scan) => (
          <div key={scan.id} className="scan-card">
            <p className="scan-name">{scan.patientName}</p>
            <p className="scan-id">ID: {scan.patientId}</p>
            <p className="scan-details">
              <span>{scan.scanType}</span> – {scan.region}
            </p>
            <p className="scan-date">
              {new Date(scan.uploadDate).toLocaleString()}
            </p>

            <img src={scan.imageUrl} alt="scan" />

            <div className="scan-actions">
              <a href={scan.imageUrl} target="_blank" rel="noreferrer">
                View Full
              </a>
              <button onClick={() => downloadPDF(scan.id)}>
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
