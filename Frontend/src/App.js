import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";   // ⬅️ import your signup page
import TechnicianUpload from "./pages/TechnicianUpload";
import DentistScans from "./pages/DentistScans";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />   {/* ⬅️ add this */}

          {/* Protected routes */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute role="Technician">
                <TechnicianUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/scans"
            element={
              <ProtectedRoute role="Dentist">
                <DentistScans />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
