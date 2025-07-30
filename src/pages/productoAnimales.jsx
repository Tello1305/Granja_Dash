
import { Header } from "../components/header.jsx";
import { Nav } from "../components/nav.jsx";
import TablaProductos from "../components/tablas/tablaProductos.jsx"
import { useState } from "react";



export function ProductoAnimales() {
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
              <TablaProductos />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
