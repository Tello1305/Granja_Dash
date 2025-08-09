import { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficosAlimentacion() {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Usuarios por Rol',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${RUTAJAVA}/api/sumaDelSistema/porRol`);
      const apiData = response.data;

      const labels = apiData.map((item) => item.rol);
      const cantidades = apiData.map((item) => item.cantidad);

      const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',  // rojo
        'rgba(54, 162, 235, 0.6)',  // azul
      ];

      const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
      ];

      setData({
        labels: labels,
        datasets: [
          {
            label: 'Cantidad de Registros',
            data: cantidades,
            backgroundColor: backgroundColors.slice(0, cantidades.length),
            borderColor: borderColors.slice(0, cantidades.length),
            borderWidth: 1,
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

  useEffect(() => {
    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Usuarios por Rol',
      },
    },
  };

  if (isLoading) {
    return <div>Cargando gráfico...</div>;
  }

  if (error) {
    return <div>Error al cargar gráfico: {error}</div>;
  }

  return (
    <div className="container">
      <div className="d-flex flex-wrap justify-content-center gap-4">
        <fieldset className="border p-3 rounded-3" >
          <legend className="float-none w-auto px-2 fs-5 fw-semibold">Usuarios</legend>
          <div className="p-2">
            <div>
              <Doughnut data={data} options={options} />
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
