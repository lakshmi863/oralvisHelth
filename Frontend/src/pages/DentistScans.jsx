import { useEffect, useState } from "react";
import API from "../api/api";

export default function DentistScans() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    API.get("/scans").then((res) => setScans(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Patient Scans</h2>
      <div className="grid grid-cols-3 gap-4">
        {scans.map((scan) => (
          <div key={scan.id} className="border p-2 rounded">
            <p><b>{scan.patientName}</b> ({scan.patientId})</p>
            <p>{scan.scanType} - {scan.region}</p>
            <p>{new Date(scan.uploadDate).toLocaleString()}</p>
            <img src={scan.imageUrl} alt="scan" className="h-32 object-cover" />
            <a
              className="text-blue-500"
              href={scan.imageUrl}
              target="_blank"
              rel="noreferrer"
            >
              View Full
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
