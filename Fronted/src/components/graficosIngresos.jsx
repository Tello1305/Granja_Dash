// Charts.jsx
import './chartSetup' // Asegúrate de importar la configuración
import { Bar, Line, } from 'react-chartjs-2'

const data = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
  datasets: [
    {
      label: 'Ventas 2024',
      data: [65, 59, 80, 81, 56],
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
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Resumen de Ventas 2024',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

export default function Graficos() {
  return (
    <div className="d-flex justify-content-center gap-4 d-flex flex-wrap ">
      <fieldset className="border p-3 rounded-3" style={{width: "530px"}}>
        <legend className="float-none w-auto px-2 fs-5 fw-semibold">Resumen de Ingresos</legend>
        <div className="p-2">
          <Bar data={data} options={options} />
        </div>
      </fieldset>
      
      <fieldset className="border p-3 rounded-3" style={{width: "530px"}}>
        <legend className="float-none w-auto px-2 fs-5 fw-semibold">Proyección de Ganancias</legend>
        <div className="p-2">
          <Line data={data} options={{ ...options, tension: 0.3 }} />
        </div>
      </fieldset>
    </div>
  )
}

