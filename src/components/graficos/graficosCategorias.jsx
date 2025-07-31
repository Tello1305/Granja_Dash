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

export default function GraficoHorizontalSeparado() {
  return (
    <div className="container-fluid p-0">
            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="card-title mb-0">Resumen Semanal</h5>
                        </div>
                        <div className="card-body p-2" >
                         
                            {data && <Bar data={data} options={options} />}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="card-title mb-0">Proyección de Ganancias</h5>
                        </div>
                        <div className="card-body p-2" >
                           
                            <Line data={lineData} options={lineOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}