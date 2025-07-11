import {Routes, Route} from 'react-router-dom'
import {AppLogin} from '../pages/login.jsx'
import {IngresosTotales} from '../pages/ingresosTotales.jsx'
import {AlimentacionRecursos} from '../pages/alimentacionRecursos.jsx'
import {ComidaAnimales} from '../pages/comidaAnimales.jsx'
import {Categorias} from '../pages/categorias.jsx'

export function RouterPublic() {
    return (
        <Routes>
            <Route path='/' element={<AppLogin />} />
            <Route path='/api/ingresosTotales' element={<IngresosTotales />} />
            <Route path='/api/alimentacionRecursos' element={<AlimentacionRecursos />} />
            <Route path='/api/comidaAnimales' element={<ComidaAnimales />} />
            <Route path='/api/categorias' element={<Categorias />} />
            
        </Routes>
    )
}