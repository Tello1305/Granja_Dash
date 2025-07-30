import { AppLogin } from '../pages/login.jsx'
import { IngresosTotales } from '../pages/ingresosTotales.jsx'
import { AlimentacionRecursos } from '../pages/alimentacionRecursos.jsx'
import { ComidaAnimales } from '../pages/comidaAnimales.jsx'
import { Categorias } from '../pages/categorias.jsx'
import { CategoriaRazas } from '../pages/categoriaRazas.jsx'
import { LoteAnimales } from '../pages/loteAnimales.jsx'
import { ProductoAnimales } from '../pages/productoAnimales.jsx'
import { Routes, Route } from "react-router-dom";
import { AuthRoute } from "../auth/protectedRouter";

export function RouterSystem() {
    return (
        <Routes>
            {/* <Route path='/' element={<AppLogin />} />
            <Route path='/GranjaDash/ingresosTotales'
                element={<AuthRoute roles={[1, 2]}> <IngresosTotales /> </AuthRoute>} />
            <Route path='/GranjaDash/alimentacionRecursos'
                element={<AuthRoute roles={[1, 2]}><AlimentacionRecursos /></AuthRoute>} />
            <Route path='/GranjaDash/comidaAnimales'
                element={<AuthRoute roles={[1, 2]}><ComidaAnimales /></AuthRoute>} />
            <Route path='/GranjaDash/categorias'
                element={<AuthRoute roles={[1, 2]}><Categorias /></AuthRoute>} />
            <Route path='/GranjaDash/categoriaRazas'
                element={<AuthRoute roles={[1, 2]}><CategoriaRazas /></AuthRoute>} />
            <Route path='/GranjaDash/LoteAnimales'
                element={<AuthRoute roles={[1, 2]}><LoteAnimales /></AuthRoute>} />
            <Route path='/GranjaDash/ProductoAnimales'
                element={<AuthRoute roles={[1, 2]}><ProductoAnimales /></AuthRoute>} /> */}

            <Route path='/' element={<AppLogin />} />
            <Route path='/GranjaDash/ingresosTotales' element={<IngresosTotales />} />
            <Route path='/GranjaDash/alimentacionRecursos' element={<AlimentacionRecursos />} />
            <Route path='/GranjaDash/comidaAnimales' element={<ComidaAnimales />} />
            <Route path='/GranjaDash/categorias' element={<Categorias />} />
            <Route path='/GranjaDash/categoriaRazas' element={<CategoriaRazas />} />
            <Route path='/GranjaDash/LoteAnimales' element={<LoteAnimales />} />
            <Route path='/GranjaDash/ProductoAnimales' element={<ProductoAnimales />} />
        </Routes>
    )
}