
import { Header } from '../components/header.jsx'
import { Nav } from '../components/nav.jsx'
import { RegistroCompra } from '../components/registroCompra.jsx'
import GraficosAlimentacion from '../components/graficos/graficosAlimentacion.jsx'
import { Calendario } from '../components/calendario.jsx'
import '../assets/css/formCompra.css'

export function AlimentacionRecursos() {
    return (
        <>
            <Header administrador="jesus" />
            <div className="main-layout w-100">
                <Nav />
                <main className="main-content w-100">
                    <div className="content-wrapper w-100">
                        <search className="container mt-5 mb-5">
                            <div className="w-100 d-flex gap-5">
                                <RegistroCompra />
                                <GraficosAlimentacion />

                            </div>
                            <div className="w-100 d-flex justify-content-center mt-4">
                                <Calendario />
                            </div>
                        </search>
                    </div>
                </main>
            </div>
        </>
    )
}