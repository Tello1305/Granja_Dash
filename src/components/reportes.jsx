import '../assets/css/reportes.css'
import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

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
    <div className="modal fade" id="ModalFiltrarReporte" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Filtrar: {reporteSeleccionado.titulo}
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div>
              <label className="form-label" htmlFor="fechaDesde">Fecha desde:</label>
              <input className="form-control" type="date" id="fechaDesde" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
            </div>
            <div className='mt-3'>
              <label className="form-label" htmlFor="fechaHasta">Fecha hasta:</label>
              <input className="form-control" type="date" id="fechaHasta" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            {/* Botones dentro del modal */}
            <button className="btn btn-reporte btn-pdf" onClick={() => handleGenerarClick('pdf')}>Generar PDF</button>
            <button className="btn btn-reporte btn-excel" onClick={() => handleGenerarClick('excel')}>Generar Excel</button>
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
    if(modal) modal.hide();
  };

  return (
    <div className="reportes-container">
      <h1 className="reportes-title">Generador de Reportes</h1>
      <div className="reportes-grid">
        {reportes.map((reporte) => (
          <div key={reporte.key} className="reporte-card">
            <div className="reporte-header">
              <h3 className="reporte-title">{reporte.titulo}</h3>
            </div>
            <div className="reporte-body">
              <div>
                <p>Descarga el reporte general o filtra por un rango de fechas.</p>
                
                {reporte.dateFilter && (
                    <button 
                      className="btn-reporte btn-pdf w-100 mb-3" 
                      data-bs-toggle="modal" 
                      data-bs-target="#ModalFiltrarReporte"
                      onClick={() => setReporteParaFiltrar(reporte)}
                    >
                      Filtrar por Fechas
                    </button>
                )}
              </div>
              
              <div className="reporte-actions">
                {/* Botón para reporte general PDF */}
                <button
                  onClick={() => handlePdfDownload(reporte)}
                  className={`btn-reporte btn-pdf ${cargandoKey === `${reporte.key}-pdf` ? 'loading' : ''}`}
                  disabled={cargandoKey === `${reporte.key}-pdf`}
                  title="Descargar PDF General"
                >
                  {cargandoKey === `${reporte.key}-pdf` ? 'Generando...' : 'PDF General'}
                </button>
                
                {/* Botón para reporte general EXCEL */}
                <button
                  onClick={() => handleExcelDownload(reporte)}
                  className={`btn-reporte btn-excel ${cargandoKey === `${reporte.key}-excel` ? 'loading' : ''}`}
                  disabled={cargandoKey === `${reporte.key}-excel`}
                  title="Descargar Excel General"
                >
                  {cargandoKey === `${reporte.key}-excel` ? 'Generando...' : 'Excel General'}
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