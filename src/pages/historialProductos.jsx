import { Header } from '../components/header.jsx';
import { Nav } from '../components/nav.jsx';
import { Historial } from '../components/historial.jsx';
import '../assets/css/layout.css'; // Importamos los nuevos estilos
import { useState } from 'react';
export function HistorialProductos() {
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
                    <div className="content-wrapper">
                        <Historial />
                    </div>
                </main>
            </div>
        </div>
    );
}