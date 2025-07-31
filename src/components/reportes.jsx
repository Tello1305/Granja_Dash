import '../assets/css/reportes.css'
import axios from 'axios'
import {useState} from 'react'
const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;


export function SeccionReportes () {

    const [cargandoKey, setCargandoKey] = useState(null);

    const reportes = [
        {key: 0,titulo: "Reporte de Categorias", url: `${RUTAJAVA}/api/reporteCategorias`, filename: 'reporteCategorias.pdf'},
        {key: 1,titulo: 'Reporte de Razas', url: `${RUTAJAVA}/api/reporteRazas`, filename: 'reporteRazas.pdf'},
        {key: 2,titulo: 'Reporte de Lotes', url: `${RUTAJAVA}/api/reporteLotes`, filename: 'reporteLotes.pdf'},
        {key: 3,titulo: 'Reporte de Productos', url: `${RUTAJAVA}/api/reporteProductos`, filename: 'reporteProductos.pdf'},
        {key: 4,titulo: 'Reporte de Citas', url: `${RUTAJAVA}/api/reporteCitas`, filename: 'reporteCitas.pdf'},
        {key: 5,titulo: 'Reporte de Alimentos', url: `${RUTAJAVA}/api/reporteAlimentos`, filename: 'reporteAlimentos.pdf'}
    ]

    const handlePdf = async (reporte) => {
        setCargandoKey(reporte.key); // Activa el estado de carga para este botón
    
        try {
          // Llamamos al endpoint correcto y especificamos el tipo de respuesta 'blob'
          const response = await axios.get(reporte.url, {
            responseType: 'blob',
          });
    
          // Lógica de descarga que vimos antes
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', reporte.filename); // Usamos el nombre de archivo correcto
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
    
        } catch (error) {
          console.error('Error al descargar el reporte:', error);
          // Aquí podrías mostrar una notificación de error al usuario
        } finally {
          setCargandoKey(null); // Desactiva el estado de carga
        }
      };
    

    
    return (
        <>
<main>
      <h1>GENERAR REPORTE</h1>
      <hr />
      <section className='d-flex justify-content-center gap-4 flex-wrap'>
        {reportes.map((reporte) => (
          <article key={reporte.key} className="articleReportes">
            <strong>{reporte.titulo}</strong>
            <hr />
            <div className="d-flex justify-content-center gap-4 flex-wrap">
              <button
                // Pasamos el objeto 'reporte' completo
                onClick={() => handlePdf(reporte)}
                className="btn btn-danger"
                // Deshabilitamos el botón si está cargando
                disabled={cargandoKey === reporte.key}
              >
                {cargandoKey === reporte.key ? 'Cargando...' : 'PDF'}
              </button>
              <button
                onClick={() => handleExcel(reporte.url)}
                className="btn btn-success"
              >
                Excel
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
        </>
    )
}