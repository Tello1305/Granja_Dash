import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/historial.css"; // Asegúrate de que esta ruta a tu CSS sea correcta

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

// Define los temas de filtro disponibles
const TEMAS_FILTRO = [
  { label: "Citas", value: "CITA" },
  { label: "Alimentos", value: "ALIMENTO" },
  { label: "Productos", value: "PRODUCTO" },
  { label: "Lotes", value: "LOTE" },
  { label: "Reportes", value: "REPORTE" },
  { label: "Categorias", value: "CATEGORIA" },
  { label: "Razas", value: "RAZA" },
];

export function Historial() {
  const [resumenes, setResumenes] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
    temas: [],
    busqueda: "",
  });

  // Carga inicial de los resúmenes (la vista por defecto)
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${RUTAJAVA}/api/historial`)
      .then((response) => setResumenes(response.data))
      .catch((error) => console.error("Error al cargar resúmenes:", error))
      .finally(() => setIsLoading(false));
  }, []);

  // Lógica de búsqueda automática que se activa cuando cambian los filtros
  useEffect(() => {
    const filtrosEstanActivos =
      filtros.fechaDesde ||
      filtros.fechaHasta ||
      filtros.temas.length > 0 ||
      filtros.busqueda;

    // Si los filtros están activos, busca. Si no, no hace nada.
    if (filtrosEstanActivos) {
      const timer = setTimeout(() => {
        const fetchActividadesFiltradas = async () => {
          try {
            setIsLoading(true);
            const params = {
              fechaDesde: filtros.fechaDesde || undefined,
              fechaHasta: filtros.fechaHasta || undefined,
              temas: filtros.temas.length > 0 ? filtros.temas.join(",") : undefined,
              busqueda: filtros.busqueda || undefined,
            };
            
            // --- CORRECCIÓN APLICADA AQUÍ ---
            // Se envuelve el objeto 'params' dentro de un objeto de configuración.
            const response = await axios.get(
              `${RUTAJAVA}/api/historial/bitacora`,
              { params }
            );

            setActividades(response.data);
          } catch (error) {
            console.error("Error al cargar actividades:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchActividadesFiltradas();
      }, 500); // Espera 500ms antes de buscar

      return () => clearTimeout(timer); // Limpia el timer si el usuario sigue interactuando
    }
  }, [filtros]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFiltros((prev) => {
      const nuevosTemas = checked
        ? [...prev.temas, value]
        : prev.temas.filter((tema) => tema !== value);
      return { ...prev, temas: nuevosTemas };
    });
  };

  const handleClearFilters = () => {
    setFiltros({ fechaDesde: "", fechaHasta: "", temas: [], busqueda: "" });
    setActividades([]); // Limpia también los resultados de actividades
  };

  const mostrarVistaDetallada =
    filtros.fechaDesde ||
    filtros.fechaHasta ||
    filtros.temas.length > 0 ||
    filtros.busqueda;

  return (
    <div className="container py-4 historial-container">
      <h1>HISTORIAL</h1>
      <hr />
      <section className="row d-flex justify-content-center">
        {/* Columna de resultados */}
        <div className="col-md-6 w-50">
          {isLoading ? (
            <p>Buscando...</p>
          ) : mostrarVistaDetallada ? (
            <>
              <h4>Resultados de la Investigación ({actividades.length})</h4>
              {actividades.length > 0 ? (
                actividades.map((actividad) => (
                  <div key={actividad.id_actividad} className="card mb-2">
                    <div className="card-body py-2">
                      <p className="card-text mb-0">{actividad.descripcion}</p>
                      <small className="text-muted">
                        {new Date(actividad.fechaHora).toLocaleString("es-PE")}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="alert alert-info">No se encontraron actividades.</div>
              )}
            </>
          ) : (
            <>
              <h4>Resúmenes Mensuales</h4>
              {resumenes.map((reporte) => (
                <div key={reporte.id_resumen} className="card mb-3">
                  <div className="card-header bg-light">
                    <strong>Periodo: {reporte.periodo}</strong>
                  </div>
                  <div className="card-body">
                    <pre className="card-text" style={{ fontFamily: "inherit", fontSize: "inherit", margin: 0 }}>
                      {reporte.resumen_texto}
                    </pre>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Columna de filtros */}
        <div className="col-md-6 card mb-4 w-50 ">
          <div className="card-body">
            <h5 className="card-title">Investigar en la Bitácora</h5>
            <form className="row g-3 mb-3">
              <div className="col-md-6">
                <label>Desde</label>
                <input type="date" name="fechaDesde" className="form-control" value={filtros.fechaDesde} onChange={handleInputChange} />
              </div>
              <div className="col-md-6">
                <label>Hasta</label>
                <input type="date" name="fechaHasta" className="form-control" value={filtros.fechaHasta} onChange={handleInputChange} />
              </div>
              <div className="col-md-12">
                <label>Palabra Clave</label>
                <input type="text" name="busqueda" className="form-control" placeholder="Buscar..." value={filtros.busqueda} onChange={handleInputChange} />
              </div>
              <div className="historial-filtros mt-3">
                <h5 className="section-title">Filtros de Búsqueda</h5>
                <div className="d-flex gap-3 flex-wrap align-items-center justify-content-start">
                  {TEMAS_FILTRO.map((tema) => (
                    <div key={tema.value} className="form-check">
                      <input className="form-check-input" type="checkbox" id={`check-${tema.value}`} value={tema.value} onChange={handleCheckboxChange} checked={filtros.temas.includes(tema.value)} />
                      <label className="form-check-label" htmlFor={`check-${tema.value}`}>{tema.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-12 mt-3">
                <button type="button" className="btn btn-orange w-100" onClick={handleClearFilters}>
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Limpiar Filtros
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}