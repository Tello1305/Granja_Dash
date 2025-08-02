import { Link, useLocation } from "react-router-dom";
import "../assets/css/header.css"; // Asegúrate de que esta ruta a tu CSS sea correcta
import { useAuth } from "../auth/authContext";
import { useNavigate } from "react-router-dom";

export function Nav({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Llama a useAuth() una sola vez para obtener el estado y las funciones
  const { auth, logout } = useAuth();

  // 1. Define la lista de todos los links y el botón de logout
  const links = [
    { to: "/GranjaDash/ingresosTotales", label: "Dashboard", icon: "bi bi-speedometer2", rol: [1, 2] },
    { to: "/GranjaDash/categorias", label: "Categorías", icon: "bi bi-tags", rol: [1, 2] },
    { to: "/GranjaDash/alimentacionRecursos", label: "Alimentación", icon: "bi bi-cup-straw", rol: [1, 2] },
    { to: "/GranjaDash/categoriaRazas", label: "Razas", icon: "bi bi-collection", rol: [1] },
    { to: "/GranjaDash/LoteAnimales", label: "Lotes", icon: "bi bi-grid-3x3", rol: [1, 2] },
    { to: "/GranjaDash/ProductoAnimales", label: "Productos", icon: "bi bi-box-seam", rol: [1, 2] },
    { to: "/GranjaDash/comidaAnimales", label: "Comida", icon: "bi bi-egg-fried", rol: [1, 2] },
    { to: "/GranjaDash/Reportes", label: "Reportes", icon: "bi bi-file-text", rol: [1] },
    { to: "/GranjaDash/Bitacora", label: "Bitacora", icon: "bi bi-file-text", rol: [1] },
    { type: 'logout', label: "Cerrar Sesión", icon: "bi bi-box-arrow-right", rol: [1, 2] } // Botón de logout tratado como un link
  ];
  
  // 2. Filtra los links basándose en el rol del usuario
  const linksVisibles = links.filter(link => 
    auth.id_rol && link.rol.includes(auth.id_rol)
  );

  // 3. Define la función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="nav-brand">
          <h3 className="nav-brand-text">Granja Dash</h3>
        </div>

        <div className="nav-menu">
          {linksVisibles.map((link) => (
            <div key={link.label} className="nav-item">
              {link.type === 'logout' ? (
                // 4. Renderizado condicional: si es tipo 'logout', muestra un botón
                <button className="nav-link logout-btn-in-list" onClick={handleLogout}>
                  <i className={`nav-icon ${link.icon}`}></i>
                  <span className="nav-text">{link.label}</span>
                </button>
              ) : (
                // De lo contrario, muestra un Link de react-router
                <Link
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <i className={`nav-icon ${link.icon}`}></i>
                  <span className="nav-text">{link.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}