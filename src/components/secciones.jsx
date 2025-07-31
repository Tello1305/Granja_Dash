import "../assets/css/main.css"
import {useState, useEffect} from "react"
import axios from "axios";

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

export function Secciones() {

    const [total, SetTotal] = useState([])

    useEffect(() => {

        const fetchTotal = async () => {
            try {
               const  response = await axios.get(`${RUTAJAVA}/api/sumaDelSistema/conteoSistema`)
                SetTotal(response.data)
                console.log("Total",response.data)
            } catch (error) {
                console.log(error)
            }
        };
        fetchTotal();
    },[])





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
    return (
        <>

            <div className="dashboard-header">
                <div className="weather-card">
                    <div className="weather-info">
                        <div className="weather-day">
                            <span className="weather-label">Weather's today</span>
                            <h2 className="weather-title">Monday</h2>
                            <span className="weather-date">10th Apr, 2023</span>
                        </div>
                        <div className="weather-temp">
                            <div className="temp-circle">
                                <span className="temp-value">25°</span>
                            </div>
                        </div>
                    </div>
                    <div className="weather-stats">
                        <div className="stat-item">
                            <i className="bi bi-cloud-drizzle"></i>
                            <span>0km/h</span>
                        </div>
                        <div className="stat-item">
                            <i className="bi bi-droplet"></i>
                            <span>89%</span>
                        </div>
                        <div className="stat-item">
                            <i className="bi bi-thermometer"></i>
                            <span>1001hPa</span>
                        </div>
                    </div>
                </div>

                <div className="growth-activity-card">
                    <div className="card-header">
                        <h3>Plant growth activity</h3>
                        <span className="period-badge">Weekly</span>
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
                            <span>Seed Phase (95%)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot fruit"></span>
                            <span>Fruit Growth (89%)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot vegetation"></span>
                            <span>Vegetation (76%)</span>
                        </div>
                    </div>
                </div>

                <div className="farm-illustration">
                    <div className="farm-scene">
                        <div className="farmer-character">👨‍🌾</div>
                        <div className="plants">🌱🌱🌱</div>
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