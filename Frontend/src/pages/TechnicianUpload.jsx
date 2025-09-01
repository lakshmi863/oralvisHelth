import { useState } from "react";
import API from "../api/api";
import "./TechnicianUpload.css"; // ✅ Import styles

export default function TechnicianUpload() {
  const [form, setForm] = useState({
    patientName: "",
    patientId: "",
    scanType: "RGB",
    region: "Frontal",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    data.append("file", file);

    await API.post("/scans/upload", data);
    alert("Uploaded successfully");
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Scan</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          className="upload-input"
          name="patientName"
          placeholder="Patient Name"
          onChange={handleChange}
        />
        <input
          className="upload-input"
          name="patientId"
          placeholder="Patient ID"
          onChange={handleChange}
        />
        <select
          className="upload-select"
          name="region"
          onChange={handleChange}
        >
          <option>Frontal</option>
          <option>Upper Arch</option>
          <option>Lower Arch</option>
        </select>
        <input
          type="file"
          className="upload-file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="upload-button">Upload</button>
      </form>
    </div>
  );
}
