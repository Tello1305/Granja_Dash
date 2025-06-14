import {Routes, Route} from 'react-router-dom'
import {AppLogin} from '../pages/login.jsx'
import {IngresosTotales} from '../pages/ingresosTotales.jsx'
import {AlimentacionRecursos} from '../pages/alimentacionRecursos.jsx'

export function RouterPublic() {
    return (
        <Routes>
            <Route path='/' element={<AppLogin />} />
            <Route path='/ingresosTotales' element={<IngresosTotales />} />
            <Route path='/alimentacionRecursos' element={<AlimentacionRecursos />} />
        </Routes>
    )
}