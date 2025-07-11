
import {Header} from '../components/header.jsx'
import {Nav} from '../components/nav.jsx'
import {RegistroCompra} from '../components/registroCompra.jsx'
import Graficos from '../components/graficosIngresos.jsx'
import '../assets/css/formCompra.css'

export function AlimentacionRecursos() {
    return (
        <>
        <Header administrador="jesus"/>
        <div className="d-flex">
        <Nav />
        <div className="w-100 d-flex gap-5">
            <RegistroCompra/>
           
        </div>
        </div>
        </>
    )
}