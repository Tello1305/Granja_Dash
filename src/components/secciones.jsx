import "../assets/css/main.css"
import gallinaImg from "../assets/img/Gallina.png";
import { useState, useEffect } from "react"
import axios from "axios";
import "../assets/css/secciones.css"

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function Secciones() {

    const [total, SetTotal] = useState([])

    useEffect(() => {

        const fetchTotal = async () => {
            try {
                const response = await axios.get(`${RUTAJAVA}/api/sumaDelSistema/conteoSistema`)
                SetTotal(response.data)
                console.log("Total", response.data)
            } catch (error) {
                console.log(error)
            }
        };
        fetchTotal();
    }, [])





    const secciones = [
        {
            titulo: "Total de Categorias",
            icon: "bi bi-tags",
            color: "#e67e22",
            value: total.Categoria
        },
        {
            titulo: "Total de Ganado",
            icon: "bi bi-collection",
            color: "#f39c12",
            value: total.Animal
        },
        {
            titulo: "Total de Razas",
            icon: "bi bi-box-seam",
            color: "#d35400",
            value: total.Raza
        },
    ]

    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateParts = new Intl.DateTimeFormat('es-ES', options).formatToParts(today);

    const dayName = dateParts.find(part => part.type === 'weekday').value;
    const day = dateParts.find(part => part.type === 'day').value;
    const month = dateParts.find(part => part.type === 'month').value;
    const year = dateParts.find(part => part.type === 'year').value;

    const formattedDate = `${day} de ${month}, ${year}`;
    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    return (
        <>

            <div className="dashboard-header">
                <div className="weather-card">
                    <div className="weather-info">
                        <div className="weather-day">
                            <span className="weather-label">Clima de Hoy</span>
                            <h2 className="weather-title">{capitalizedDayName}</h2>
                            <span className="weather-date">{formattedDate}</span>
                        </div>
                        <div className="weather-temp">
                            <div className="temp-circle">
                                <span className="temp-value">25°</span>
                            </div>
                        </div>
                    </div>
                    <div className="weather-stats">
                        <div className="stat-item">
                            <i className="bi bi-wind"></i>
                            <span>15km/h</span>
                        </div>
                        <div className="stat-item">
                            <i className="bi bi-droplet"></i>
                            <span>87%</span>
                        </div>
                        <div className="stat-item">
                            <i className="bi bi-thermometer-half"></i>
                            <span>1012hPa</span>
                        </div>
                    </div>
                </div>

                <div className="growth-activity-card">
                    <div className="card-header">
                        <h3>Producción de Huevos en General</h3>
                        <span className="period-badge">Semanal</span>
                    </div>
                    <div className="growth-chart">
                        <div className="growth-line">
                            <div className="growth-point active">
                                <span className="growth-value">95%</span>
                            </div>
                            <div className="growth-point">
                                <span className="growth-value">89%</span>
                            </div>
                            <div className="growth-point">
                                <span className="growth-value">76%</span>
                            </div>
                        </div>
                    </div>
                    <div className="growth-legend">
                        <div className="legend-item">
                            <span className="legend-dot seed"></span>
                            <span>Producción Alta (95%)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot fruit"></span>
                            <span>Producción Media (89%)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot vegetation"></span>
                            <span>Producción Baja (76%)</span>
                        </div>
                    </div>
                </div>

                <div className="farm-illustration">
                    <div className="farm-scene d-flex align-items-center justify-content-center p-0 position-relative">
                        <img className="img-fluid w-50 imagenGallina " src={gallinaImg} alt="GALLINA" />
                    </div>
                </div>
            </div>

            <div className="summary-cards">
                {secciones.map((seccion, index) => (
                    <div key={index} className="summary-card card-modern">
                        <div className="card-icon" style={{ backgroundColor: seccion.color }}>
                            <i className={seccion.icon}></i>
                        </div>
                        <div className="card-content">
                            <div className="card-value">{seccion.value}</div>
                            <div className="card-title">{seccion.titulo}</div>
                        </div>
                        <div className="card-trend">
                            <i className="bi bi-arrow-up trend-icon"></i>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}