
import { Header } from '../components/header.jsx'
import { Nav } from '../components/nav.jsx'
import { RegistroCompra } from '../components/registroCompra.jsx'
import GraficosAlimentacion from '../components/graficos/graficosAlimentacion.jsx'
import { Calendario } from '../components/calendario.jsx'
import '../assets/css/alimentacion.css'
import { useState } from 'react'

export function AlimentacionRecursos() {
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
                        <div className="content-wrapper w-100">
                            <div className=" w-100 ">
                                <div className="row g-2 g-md-1 g-lg-4 ">
                                    <div className="col-12 col-md-6">
                                        <div className="formComprar w-100 d-flex align-items-center justify-content-start">
                                            <RegistroCompra />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="graficosRecursos w-100 d-flex align-items-center justify-content-center">
                                            <GraficosAlimentacion />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="calendario-container h-100 w-100  d-flex align-items-center justify-content-center mt-4 lg-5">
                                <Calendario />
                            </div>
                        </div>
                    </main>
                </div >
            </div >
        </>
    )
}