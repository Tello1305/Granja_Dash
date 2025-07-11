import { Bar } from 'react-chartjs-2'
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

const data = {
  labels: ['Maíz', 'Alfalfa', 'Concentrado', 'Trigo', 'Vitaminas'],
  datasets: [
    {
      label: 'Consumo (kg)',
      data: [40, 35, 50, 25, 20],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      barThickness: 20, // 👈 Esto controla el grosor
    },
  ],
}

const options = {
  indexAxis: 'y', // horizontal
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Raza de animales',
    },
  },
  scales: {
    x: {
      beginAtZero: true,
    },
  },
}

export default function GraficoHorizontalSeparado() {
  return (
    <fieldset className="border p-3 rounded-3" style={{ width: '530px' }}>
      <legend className="float-none w-auto px-2 fs-5 fw-semibold">Raza de animales</legend>
      <Bar data={data} options={options} />
    </fieldset>
  )
}