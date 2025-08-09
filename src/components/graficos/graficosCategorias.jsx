import {useState, useEffect} from "react";
import axios from "axios";

import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, 
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)


const lineData = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [
    {
      label: 'Crecimiento del Ganado',
      data: [100, 110, 115, 125, 130],
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.1
    }
  ]
};

const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Crecimiento Mensual del Ganado',
    },
  },
  scales: {
    y: {
      beginAtZero: false
    }
  }
};

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export default function GraficoHorizontalSeparado() {
  const [chartData, setChartData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Registros por Tabla',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${RUTAJAVA}/api/sumaDelSistema/conteoTablas`);
        const apiData = response.data;
      
        setChartData({
          labels: ['Categoria', 'Raza', 'Lote', 'Producto', 'Alimento'],
          datasets: [
            {
              label: 'Cantidad de Registros',
              data: [apiData.Categoria, apiData.Raza, apiData.Lote, apiData.Producto, apiData.Alimento],
              backgroundColor: 'rgba(241, 131, 40, 0.6)',
              borderColor: 'rgb(238, 113, 10)',
              borderWidth: 2,
              barThickness: 80,
            },
          ],
        });

      } catch (err) {
        console.error("Error al cargar los datos del gráfico:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid p-0">
            <div className="row g-3">
                <div className="col-12 col-lg-12">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="card-title mb-0">Cantidad de Registros por Tabla</h5>
                        </div>
                        <div className="card-body p-2" >
                         
                            {isLoading ? (
                              <p>Cargando gráfico...</p>
                            ) : error ? (
                              <div className="alert alert-danger">Error: {error}</div>
                            ) : chartData ? (
                              <Bar data={chartData} options={options} />
                            ) : (
                              <p>No hay datos para mostrar.</p>
                            )}
                        </div>
                    </div>
                </div>  
          </div>
    </div>
  )
}