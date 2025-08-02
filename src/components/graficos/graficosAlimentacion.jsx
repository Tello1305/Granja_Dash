// graficosAlimentacion.jsx
import '../chartSetup' // Asegúrate de importar la configuración
import { Bar, Doughnut } from 'react-chartjs-2'

const barData = {
  labels: ['Maíz', 'Soja', 'Trigo', 'Avena', 'Cebada'],
  datasets: [
    {
      label: 'Stock de Alimentos (kg)',
      data: [120, 150, 90, 60, 75],
      backgroundColor: [
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(54, 162, 235, 0.5)',
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 1,
    },
  ],
}

const doughnutData = {
  labels: ['Proteínas', 'Carbohidratos', 'Grasas', 'Vitaminas', 'Minerales'],
  datasets: [
    {
      label: 'Distribución Nutricional',
      data: [30, 50, 10, 5, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Stock Actual de Alimentos',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}
const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Distribución Nutricional General',
    },
  },
};

export default function GraficosAlimentacion() {
  return (
    <div className="container ">
      <div className="d-flex flex-wrap justify-content-center gap-4">
        <fieldset className="border p-3 rounded-3" style={{ height: "350px", flex: "1 1 600px", overflowX: "auto" }}>
          <legend className="float-none w-auto px-2 fs-5 fw-semibold">Stock de Alimentos</legend>
          <div className="p-2">
            <div style={{ height: "300px", width: "600px", minWidth: "600px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </fieldset>



      </div>
    </div>
  )
}
