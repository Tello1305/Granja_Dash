import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

// Es buena práctica registrar explícitamente los componentes de Chart.js que usarás
ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend
);

// Usamos la variable de entorno que definiste
const RUTAJAVA = import.meta.env.VITE_RUTAJAVA || 'http://localhost:8080';

export default function Graficos() {
    // 1. Estados para los datos, la carga y los errores
    const [barChartData, setBarChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Usamos la URL correcta de tu backend para este gráfico
          const response = await axios.get(`${RUTAJAVA}/api/sumaDelSistema/movimientosSemana`);
          const apiData = response.data;
  
          const labels = Object.keys(apiData);
          const entradas = labels.map(label => apiData[label].entrada);
          const salidas = labels.map(label => apiData[label].salida);
  
          // 2. Renombrado para mayor claridad
          setBarChartData({
            labels: labels,
            datasets: [
              {
                label: 'Entradas',
                data: entradas,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
              },
              {
                label: 'Salidas',
                data: salidas,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
              },
            ],
          });
        } catch (err) {
          setError('No se pudieron cargar los datos para el gráfico.');
          console.error('Error al obtener los datos:', err);
        } finally {
          // 3. El estado de carga termina, sin importar si hubo éxito o error
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const barChartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Movimientos de Stock Entradas y Salidas',
        },
      },
      scales: {
        y: { beginAtZero: true },
      },
    };

    // 4. Datos de ejemplo para el segundo gráfico para no mezclar la información
    const lineChartDataExample = {
        labels: ['Hoy', 'Ayer', 'Hace una Semana'],
        datasets: [{
            label: 'Proyección de Stock',
            data: [150, 180, 160], 
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    // 5. Renderizado condicional para mostrar un estado de carga y evitar errores
    if (loading) {
        return <p className="text-center p-5">Cargando gráficos...</p>;
    }

    if (error) {
        return <p className="text-center text-danger p-5">{error}</p>;
    }

    return (
        <div className="container-fluid p-0">
            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="card-title mb-0">Resumen Semanal</h5>
                        </div>
                        <div className="card-body p-2" style={{ minHeight: '300px' }}>
                         
                            {barChartData && <Bar data={barChartData} options={barChartOptions} />}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="card-title mb-0">Proyección de Ganancias</h5>
                        </div>
                        <div className="card-body p-2" style={{ minHeight: '300px' }}>
                           
                            <Line data={lineChartDataExample} options={{...barChartOptions, plugins: {...barChartOptions.plugins, title: {display: true, text:'Proyección'}}}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}