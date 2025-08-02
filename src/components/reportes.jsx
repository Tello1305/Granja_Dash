import '../assets/css/reportes.css'
import axios from 'axios'
import { useState } from 'react'
const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;


export function SeccionReportes() {

  const [cargandoKey, setCargandoKey] = useState(null);

  const reportes = [
    { key: 0, titulo: "Reporte de Categorias", url: `${RUTAJAVA}/api/reporteCategorias`, filename: 'reporteCategorias.pdf' },
    { key: 1, titulo: 'Reporte de Razas', url: `${RUTAJAVA}/api/reporteRazas`, filename: 'reporteRazas.pdf' },
    { key: 2, titulo: 'Reporte de Lotes', url: `${RUTAJAVA}/api/reporteLotes`, filename: 'reporteLotes.pdf' },
    { key: 3, titulo: 'Reporte de Productos', url: `${RUTAJAVA}/api/reporteProductos`, filename: 'reporteProductos.pdf' },
    { key: 4, titulo: 'Reporte de Citas', url: `${RUTAJAVA}/api/reporteCitas`, filename: 'reporteCitas.pdf' },
    { key: 5, titulo: 'Reporte de Alimentos', url: `${RUTAJAVA}/api/reporteAlimentos`, filename: 'reporteAlimentos.pdf' }
  ]

  const handlePdf = async (reporte) => {
    setCargandoKey(reporte.key);

    try {
      const response = await axios.get(reporte.url, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', reporte.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al descargar el reporte:', error);
      // Aquí podrías mostrar una notificación de error al usuario
    } finally {
      setCargandoKey(null);
    }
  };

  const handleExcel = async (url) => {
    try {
      const excelUrl = url.replace('.pdf', '.xlsx');
      const filename = url.split('/').pop().replace('.pdf', '.xlsx');

      const response = await axios.get(excelUrl, {
        responseType: 'blob',
      });

      const urlExcel = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlExcel;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlExcel);

    } catch (error) {
      console.error('Error al descargar el reporte Excel:', error);
      // Aquí podrías mostrar una notificación de error al usuario
    }
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
              <p className="mb-4">Descarga el reporte en el formato que prefieras</p>
              <div className="reporte-actions">
                <button
                  onClick={() => handlePdf(reporte)}
                  className={`btn-reporte btn-pdf ${cargandoKey === reporte.key ? 'loading' : ''}`}
                  disabled={cargandoKey === reporte.key}
                  title="Descargar PDF"
                >
                  <i className="bi bi-file-earmark-pdf"></i>
                  {cargandoKey === reporte.key ? 'Generando...' : 'PDF'}
                </button>
                <button
                  onClick={() => handleExcel(reporte.url)}
                  className="btn-reporte btn-excel"
                  title="Descargar Excel"
                >
                  <i className="bi bi-file-earmark-excel"></i>
                  <span>Excel</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}