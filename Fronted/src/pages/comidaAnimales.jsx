import { Header } from '../components/header.jsx';
import { Nav } from '../components/nav.jsx';
import AlimentacionList from '../components/tablaAlimentacion.jsx';
import '../assets/css/layout.css'; // Importamos los nuevos estilos

export function ComidaAnimales() {
    return (
        <div className="main-container">
            <Header administrador="jesus" />
            <div className="content-wrapper">
                <Nav />
                <main className="page-content">
                    <AlimentacionList />
                </main>
            </div>
        </div>
    );
}