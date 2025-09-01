import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", { email, password });

    // Ensure user exists
    const { user, token } = res.data;
    if (!user || !user.role) {
      throw new Error("Invalid login response: missing role");
    }

    login(res.data);

    if (user.role === "Technician") navigate("/upload");
    else if (user.role === "Dentist") navigate("/scans");
    else navigate("/"); // fallback
  } catch (err) {
    console.error("Login error:", err.message);
    alert(err.response?.data?.error || err.message || "Login failed");
  }
};

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="p-6 bg-white shadow rounded"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl mb-4">Login</h2>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
