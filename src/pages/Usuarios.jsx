import { Header } from '../components/header.jsx';
import { Nav } from '../components/nav.jsx';
//import AlimentacionList from '../components/tablas/tablaAlimentacion.jsx';
import UsuariosList from '../components/tablas/tablaUsuarios.jsx';

import { useState } from 'react';
export function Usuarios() {
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
                        <h1>Gestion de Usuarios</h1>
                        <hr />
                        <UsuariosList />
                    </div>
                </main>
            </div>
        </div>
    );
}