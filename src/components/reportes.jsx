import '../assets/css/reportes.css'
import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import '../assets/css/tipografia.css';

// --- Componente del Modal (ahora dentro del mismo archivo) ---
// Se encarga de la interfaz para seleccionar las fechas.
function FiltrarReporte({ reporteSeleccionado, onGenerarReporte }) {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const handleGenerarClick = (tipo) => {
    if (!fechaDesde || !fechaHasta) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, seleccione ambas fechas.',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    // Llama a la función del componente padre para generar el reporte
    onGenerarReporte(tipo, fechaDesde, fechaHasta);
  };

  if (!reporteSeleccionado) return null;

  return (
    <div className="modal fade" id="ModalFiltrarReporte" tabIndex="-1" aria-labelledby="modalFiltrarLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-gradient" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
            <div className="d-flex align-items-center">
              <i className="bi bi-funnel-fill text-white me-3" style={{ fontSize: '1.5rem' }}></i>
              <div>
                <h3 className="modal-title fs-4 text-black  mb-0" id="modalFiltrarLabel">
                  Filtrar Reporte
                </h3>
                <small className="text-black-50">{reporteSeleccionado.titulo}</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold text-dark" htmlFor="fechaDesde">
                  <i className="bi bi-calendar-event me-2 text-primary"></i>
                  Fecha de inicio
                </label>
                <input
                  className="form-control form-control-lg border-2"
                  type="date"
                  id="fechaDesde"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold text-dark" htmlFor="fechaHasta">
                  <i className="bi bi-calendar-check me-2 text-primary"></i>
                  Fecha de fin
                </label>
                <input
                  className="form-control form-control-lg border-2"
                  type="date"
                  id="fechaHasta"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>
            </div>

            <div className="alert alert-info mt-4 border-0" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
              <i className="bi bi-info-circle me-2"></i>
              Seleccione un rango de fechas para generar un reporte filtrado con los datos específicos del período.
            </div>
          </div>

          <div className="modal-footer bg-light border-0 p-4">
            <div className="d-flex gap-3 w-100 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary px-4 py-2"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                className="btn btn-reporte btn-pdf px-4 py-2"
                onClick={() => handleGenerarClick('pdf')}
              >
                <i className="bi bi-file-pdf me-2 text-white  "></i>
               
              </button>
              <button
                className="btn btn-reporte btn-excel px-4 py-2"
                onClick={() => handleGenerarClick('excel')}
              >
                <i className="bi bi-file-excel me-2 text-white"></i>
            
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- Componente Principal ---
const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function SeccionReportes() {

  const [cargandoKey, setCargandoKey] = useState(null);
  const [reporteParaFiltrar, setReporteParaFiltrar] = useState(null);

  const reportes = [
    { key: 0, titulo: "Reporte de Categorias", pdfUrl: `${RUTAJAVA}/api/reportes/categorias/pdf`, excelUrl: `${RUTAJAVA}/api/reportes/categorias/excel`, filename: 'reporteCategorias', dateFilter: true },
    { key: 1, titulo: 'Reporte de Razas', pdfUrl: `${RUTAJAVA}/api/reportes/razas/pdf`, excelUrl: `${RUTAJAVA}/api/reportes/razas/excel`, filename: 'reporteRazas', dateFilter: true },
    { key: 2, titulo: 'Reporte de Lotes', pdfUrl: `${RUTAJAVA}/api/reportes/lotes/pdf`, excelUrl: `${RUTAJAVA}/api/reportes/lotes/excel`, filename: 'reporteLotes', dateFilter: true },
    { key: 3, titulo: 'Reporte de Productos', pdfUrl: `${RUTAJAVA}/api/reportes/productos/pdf`, excelUrl: `${RUTAJAVA}/api/reportes/productos/excel`, filename: 'reporteProductos', dateFilter: true },
    { key: 4, titulo: 'Reporte de Citas', pdfUrl: `${RUTAJAVA}/api/reportes/citas/pdf`, excelUrl: `${RUTAJAVA}/api/reportes/citas/excel`, filename: 'reporteCitas', dateFilter: true },
    { key: 5, titulo: 'Reporte de Alimentos', pdfUrl: `${RUTAJAVA}/api/reportes/alimentos/pdf`, excelUrl: `${RUTAJAVA}/api/reportes/alimentos/excel`, filename: 'reporteAlimentos', dateFilter: true },
    { key: 6, titulo: 'Reporte de Stock de Alimentos', pdfUrl: `${RUTAJAVA}/api/reportes/stockAlimentos/pdf`, excelUrl: `${RUTAJAVA}/api/reportes/stockAlimentos/excel`, filename: 'ReporteDeStockAlimentos', dateFilter: true },
    { key: 7, titulo: 'Reporte de Stock de Productos', pdfUrl: `${RUTAJAVA}/api/reportes/stockProductos/pdf`, excelUrl: `${RUTAJAVA}/api/reportes/stockProductos/excel`, filename: 'ReporteDeStockProductos', dateFilter: true }
  ];

  // --- LÓGICA DE DESCARGA ---
  // Función genérica que realiza la petición y descarga del archivo
  const descargarArchivo = async (url, filename) => {
    try {
      const response = await axios.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
    }
  };

  // Función específica para descargar PDFs
  const handlePdfDownload = async (reporte, fechaDesde = null, fechaHasta = null) => {
    const loadingKey = `${reporte.key}-pdf`;
    setCargandoKey(loadingKey);
    let finalUrl = reporte.pdfUrl;
    if (fechaDesde && fechaHasta) {
      finalUrl += `?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
    }
    await descargarArchivo(finalUrl, `${reporte.filename}.pdf`);
    setCargandoKey(null);
  };

  // Función específica para descargar Excels
  const handleExcelDownload = async (reporte, fechaDesde = null, fechaHasta = null) => {
    const loadingKey = `${reporte.key}-excel`;
    setCargandoKey(loadingKey);
    let finalUrl = reporte.excelUrl;
    if (fechaDesde && fechaHasta) {
      finalUrl += `?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
    }
    await descargarArchivo(finalUrl, `${reporte.filename}.xlsx`);
    setCargandoKey(null);
  };

  // Función que se llama desde el modal para generar el reporte filtrado
  const generarReporteFiltrado = (tipo, fechaDesde, fechaHasta) => {
    if (!reporteParaFiltrar) return;

    if (tipo === 'pdf') {
      handlePdfDownload(reporteParaFiltrar, fechaDesde, fechaHasta);
    } else if (tipo === 'excel') {
      handleExcelDownload(reporteParaFiltrar, fechaDesde, fechaHasta);
    }

    // Cierra el modal después de generar el reporte
    const modalElement = document.getElementById('ModalFiltrarReporte');
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
  };

  return (
    <div className="reportes-container">
      <div className="text-center mb-2">
        <h1 className="reportes-title concert-one-regular ">Sistema de Reportes Empresariales</h1>
       
      </div>

      <div className="reportes-grid">
        {reportes.map((reporte) => (
          <div key={reporte.key} className="reporte-card">
            <div className="reporte-header">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-file-earmark-text me-2" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <h3 className="reporte-title">{reporte.titulo}</h3>
            </div>
            <div className="reporte-body">
             
              {reporte.dateFilter && (
                <button
                  className="btn-reporte btn-filter"
                  data-bs-toggle="modal"
                  data-bs-target="#ModalFiltrarReporte"
                  onClick={() => setReporteParaFiltrar(reporte)}
                >
                  <i className="bi bi-funnel me-2"></i>
                  Filtrar por Fechas
                </button>
              )}

              <div className="reporte-actions">
                <button
                  onClick={() => handlePdfDownload(reporte)}
                  className={`btn-reporte btn-pdf ${cargandoKey === `${reporte.key}-pdf` ? 'loading' : ''}`}
                  disabled={cargandoKey === `${reporte.key}-pdf`}
                  title="Descargar reporte en formato PDF"
                >
                  <i className="bi bi-file-pdf"></i>
                  {cargandoKey === `${reporte.key}-pdf` ? 'Generando...' : 'PDF'}
                </button>

                <button
                  onClick={() => handleExcelDownload(reporte)}
                  className={`btn-reporte btn-excel ${cargandoKey === `${reporte.key}-excel` ? 'loading' : ''}`}
                  disabled={cargandoKey === `${reporte.key}-excel`}
                  title="Descargar reporte en formato Excel"
                >
                  <i className="bi bi-file-excel"></i>
                  {cargandoKey === `${reporte.key}-excel` ? 'Generando...' : 'Excel'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FiltrarReporte
        reporteSeleccionado={reporteParaFiltrar}
        onGenerarReporte={generarReporteFiltrado}
      />
    </div>
  )
}