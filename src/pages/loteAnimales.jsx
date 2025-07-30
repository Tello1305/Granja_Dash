
import { Header } from "../components/header.jsx";
import { Nav } from "../components/nav.jsx";
import TablaLotesAnimales from "../components/tablas/tablaLotesAnimales.jsx";
import { useState } from "react";

export function LoteAnimales() {
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
                            <TablaLotesAnimales />
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}