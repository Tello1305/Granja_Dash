import { Header } from "../components/header.jsx";
import { Nav } from "../components/nav.jsx";
import { Secciones } from "../components/secciones.jsx";
import GraficoHorizontalSeparado from "../components/graficos/graficosCategorias.jsx";
import { useState } from "react";


export function Categorias() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  return (
    <>
      <div className="app-layout w-100">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="main-layout w-100">
          <Nav isOpen={sidebarOpen} onClose={closeSidebar} />
          <main className="main-content w-100">
            <div className="content-wrapper">
              <Secciones />
              <div className="charts-section">
                <GraficoHorizontalSeparado />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
