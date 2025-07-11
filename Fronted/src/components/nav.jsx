import { Link } from "react-router-dom";
import "../assets/css/header.css";

export function Nav() {
  const links = [
    {
      to: "/api/ingresosTotales",
      label: <i className="bi bi-house-gear-fill iconNav"></i>,
    },
    {
      to: "/api/categorias",
      label: <i className="bi bi-graph-up iconNav"></i>,
    },
    {
      to: "/api/alimentacionRecursos",
      label: <i className="bi bi-gear-fill iconNav"></i>,
    },
    {
      to: "/api/comidaAnimales",
      label: <i className="bi bi-question-circle-fill iconNav"></i>,
    },
    {
      to: "/api/categoriaProductos",
      label: <i className="bi bi-question-circle-fill iconNav"></i>,
    },
    {
      to: "/api/historialDeProductos",
      label: <i className="bi bi-question-circle-fill iconNav"></i>,
    },
    

  ];

  return (
    <nav className="p-2">
      <ul className="d-flex justify-content-center flex-column p-0 gap-3 mt-4">
        {links.map((link, index) => (
          <li
            key={index}
            className="list-unstyled d-flex justify-content-center"
          >
            <Link
              to={link.to}
              className="text-decoration-none p-2 d-flex align-items-center justify-content-center rounded border contenLink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
