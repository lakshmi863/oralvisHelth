import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Dentist"); // default role
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { email, password, role });
      alert("✅ Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.message);
      alert(err.response?.data?.error || err.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create Account ✨</h2>

        <input
          className="signup-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="signup-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="signup-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Dentist">Dentist</option>
          <option value="Technician">Technician</option>
        </select>

        <button className="signup-button">Sign Up</button>

        <p className="signup-footer">
          Already have an account?{" "}
          <span
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
