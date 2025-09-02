import { useNavigate } from "react-router-dom";
import "./Navbar.css";   // ✅ Import CSS

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
   
      <div className="nav-links">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
