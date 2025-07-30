import { Link, useLocation } from "react-router-dom";
import "../assets/css/header.css";
import { useAuth } from "../auth/authContext";
import { useNavigate } from "react-router-dom";

export function Nav({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/GranjaDash/login");
  };
  const links = [
    {
      to: "/GranjaDash/ingresosTotales",
      label: "Dashboard",
      icon: "bi bi-speedometer2",
    },
    {
      to: "/GranjaDash/categorias",
      label: "Categorías",
      icon: "bi bi-tags",
    },
    {
      to: "/GranjaDash/alimentacionRecursos",
      label: "Alimentación",
      icon: "bi bi-cup-straw",
    },
    {
      to: "/GranjaDash/categoriaRazas",
      label: "Razas",
      icon: "bi bi-collection",
    },
    {
      to: "/GranjaDash/LoteAnimales",
      label: "Lotes",
      icon: "bi bi-grid-3x3",
    },
    {
      to: "/GranjaDash/ProductoAnimales",
      label: "Productos",
      icon: "bi bi-box-seam",
    },
    {
      to: "/GranjaDash/comidaAnimales",
      label: "Comida",
      icon: "bi bi-egg-fried",
    },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} >
        <div className="nav-brand">
          <h3 className="nav-brand-text">Granja Dash</h3>
        </div>

        <div className="nav-menu">
          {links.map((link, index) => (
            <div key={index} className="nav-item">
              <Link
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={onClose}
              >
                <i className={`nav-icon ${link.icon}`}></i>
                <span className="nav-text">{link.label}</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="nav-logout">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </>
  );
}
