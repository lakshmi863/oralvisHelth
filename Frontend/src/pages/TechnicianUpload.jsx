import { useState } from "react";
import API from "../api/api";

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
    <div className="p-6">
      <h2 className="text-xl mb-4">Upload Scan</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="patientName" placeholder="Patient Name" onChange={handleChange} />
        <input name="patientId" placeholder="Patient ID" onChange={handleChange} />
        <select name="region" onChange={handleChange}>
          <option>Frontal</option>
          <option>Upper Arch</option>
          <option>Lower Arch</option>
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="bg-green-500 text-white px-4 py-2">Upload</button>
      </form>
    </div>
  );
}
