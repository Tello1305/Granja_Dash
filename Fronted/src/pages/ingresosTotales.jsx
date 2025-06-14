
import {Header} from '../components/header.jsx'
import {Nav} from '../components/nav.jsx'
import {Secciones} from '../components/secciones.jsx'

export function IngresosTotales() {
    return (
        <>
        <Header administrador="jesus"/>
        <div className="d-flex">
        <Nav />
        <Secciones dataGeneral="1000" />
        </div>
        </>
    )
}

