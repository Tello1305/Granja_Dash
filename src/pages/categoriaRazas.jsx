import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../auth/authContext.jsx";
import { Header } from "../components/header.jsx";
import { Nav } from "../components/nav.jsx";
import "../assets/css/layout.css";
import TablaCategoria from "../components/tablas/tablaCategoria.jsx";
import TablaRazaAnimal from "../components/tablas/tablaRazaAnimal.jsx";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function CategoriaRazas() {
  const { auth } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [razas, setRazas] = useState([]);

  const fetchCategorias = async () => {
    if (!auth.token) return;
    try {
      const response = await axios.get(`${RUTAJAVA}/api/CategoriaProductos`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const fetchRazas = async () => {
    if (!auth.token) return;
    try {
      const response = await axios.get(`${RUTAJAVA}/api/razaAnimales`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRazas(response.data);
    } catch (error) {
      console.error("Error al obtener las razas:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchRazas();
  }, [auth.token]);

  const handleDataUpdate = () => {
    fetchCategorias();
    fetchRazas();
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout w-100">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="main-layout w-100">
        <Nav isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className="main-content w-100">
          <div className="content-wrapper w-100">
            <div className="d-flex flex-column flex-md-row gap-4 w-100">
              <section className="w-100 w-md-50">
                <h2>Categorias</h2>
                <hr />
                <TablaCategoria
                  categoriasData={categorias}
                  onDataUpdate={fetchCategorias}
                />
              </section>
              <section className="w-100 w-md-50">
                <h2>Razas</h2>
                <hr />
                <TablaRazaAnimal
                  razasData={razas}
                  onDataUpdate={handleDataUpdate}
                />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
