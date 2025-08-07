import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend
);

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function Graficos() {
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar gráfico de barras (Entradas y Salidas)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${RUTAJAVA}/api/sumaDelSistema/movimientosSemana`);
        const apiData = response.data;

        const labels = Object.keys(apiData);
        const entradas = labels.map(label => apiData[label].entrada);
        const salidas = labels.map(label => apiData[label].salida);

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
        setError('No se pudieron cargar los datos del gráfico de entradas y salidas.');
        console.error('Error al obtener los datos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cargar gráfico de línea (Bitácora por días de la semana)
  useEffect(() => {
    const fetchSemana = async () => {
      try {
        const response = await axios.get(`${RUTAJAVA}/api/sumaDelSistema/cantidadPorDiaSemana`);
        const apiData = response.data;

        const labels = apiData.map(item => item.dia); // ['Lunes', 'Martes', ..., 'Domingo']
        const cantidades = apiData.map(item => item.cantidad);

        setLineChartData({
          labels,
          datasets: [
            {
              label: 'Registros en Bitácora',
              data: cantidades,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        });
      } catch (err) {
        setError('No se pudieron cargar los datos del gráfico de bitácora semanal.');
        console.error('Error al obtener datos de la bitácora:', err);
      }
    };

    fetchSemana();
  }, []);

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Movimientos de Stock (Entradas y Salidas)',
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Registros en Bitácora por Día (Semana Actual)',
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

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
              <h5 className="card-title mb-0">Resumen Semanal (Stock)</h5>
            </div>
            <div className="card-body p-2" style={{ minHeight: '300px' }}>
              {barChartData && <Bar data={barChartData} options={barChartOptions} />}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">Bitácora Semanal</h5>
            </div>
            <div className="card-body p-2" style={{ minHeight: '300px' }}>
              {lineChartData && <Line data={lineChartData} options={lineChartOptions} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}