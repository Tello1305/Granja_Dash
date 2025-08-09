import "../assets/css/main.css"
import agricultura from "../assets/img/agricultura-alimentos-saludables.jpg";
import { useState, useEffect } from "react"
import axios from "axios";
import "../assets/css/secciones.css"

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;
const OPENWEATHER_API_KEY = "967a064b326137698caf264760c20c10";

export function Secciones() {

    const [total, SetTotal] = useState([])
    const [weatherData, setWeatherData] = useState({
        temp: '--',
        wind: { speed: '--' },
        humidity: '--',
        pressure: '--',
        description: 'Cargando...',
        icon: '01d'
    });
    const [loading, setLoading] = useState(true);
    const [productionData, setProductionData] = useState({
        totalProducts: 0,
        highProduction: 0,
        mediumProduction: 0,
        lowProduction: 0,
        loading: true
    });

    useEffect(() => {
        let mounted = true;

        const fetchTotal = async () => {
            try {
                if (mounted) {
                    const response = await axios.get(`${RUTAJAVA}/api/sumaDelSistema/conteoSistema`)
                    SetTotal(response.data)
                    console.log("Total", response.data)
                }
            } catch (error) {
                console.log(error)
            }
        };

        fetchTotal();

        return () => {
            mounted = false;
        };
    }, [])

    useEffect(() => {
        let mounted = true;

        const fetchProductionData = async () => {
            try {
                if (mounted) {
                    setProductionData(prev => ({ ...prev, loading: true }));

                    // Obtener datos de productos
                    const response = await axios.get(`${RUTAJAVA}/api/productoAnimales`);
                    const productos = response.data;

                    if (productos && productos.length > 0) {
                        const totalProducts = productos.length;

                        // Calcular niveles de producción basados en cantidad
                        const sortedProducts = productos.sort((a, b) => b.cantidad - a.cantidad);
                        const tercio = Math.ceil(totalProducts / 3);

                        const highProduction = sortedProducts.slice(0, tercio).length;
                        const mediumProduction = sortedProducts.slice(tercio, tercio * 2).length;
                        const lowProduction = sortedProducts.slice(tercio * 2).length;

                        // Calcular porcentajes
                        const highPercent = Math.round((highProduction / totalProducts) * 100);
                        const mediumPercent = Math.round((mediumProduction / totalProducts) * 100);
                        const lowPercent = Math.round((lowProduction / totalProducts) * 100);

                        if (mounted) {
                            setProductionData({
                                totalProducts,
                                highProduction: highPercent,
                                mediumProduction: mediumPercent,
                                lowProduction: lowPercent,
                                loading: false
                            });
                        }
                    } else {
                        // Datos por defecto si no hay productos
                        if (mounted) {
                            setProductionData({
                                totalProducts: 0,
                                highProduction: 0,
                                mediumProduction: 0,
                                lowProduction: 0,
                                loading: false
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching production data:', error);
                // Datos por defecto en caso de error
                if (mounted) {
                    setProductionData({
                        totalProducts: 0,
                        highProduction: 35,
                        mediumProduction: 40,
                        lowProduction: 25,
                        loading: false
                    });
                }
            }
        };

        fetchProductionData();

        return () => {
            mounted = false;
        };
    }, [])

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);

                // Obtener ubicación del usuario
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;

                            try {
                                const response = await axios.get(
                                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
                                );

                                const data = response.data;
                                setWeatherData({
                                    temp: Math.round(data.main.temp),
                                    wind: { speed: Math.round(data.wind.speed * 3.6) }, // Convertir m/s a km/h
                                    humidity: data.main.humidity,
                                    pressure: data.main.pressure,
                                    description: data.weather[0].description,
                                    icon: data.weather[0].icon
                                });
                                setLoading(false);
                            } catch (error) {
                                console.error('Error fetching weather data:', error);
                                // Usar datos por defecto de Lima, Perú si falla
                                fetchDefaultWeather();
                            }
                        },
                        (error) => {
                            console.error('Error getting location:', error);
                            // Usar datos por defecto de Lima, Perú si no se puede obtener ubicación
                            fetchDefaultWeather();
                        }
                    );
                } else {
                    // Usar datos por defecto si geolocalización no está disponible
                    fetchDefaultWeather();
                }
            } catch (error) {
                console.error('Error in weather fetch:', error);
                fetchDefaultWeather();
            }
        };

        const fetchDefaultWeather = async () => {
            try {
                // Lima, Perú como ubicación por defecto
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=Lima,PE&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
                );

                const data = response.data;
                setWeatherData({
                    temp: Math.round(data.main.temp),
                    wind: { speed: Math.round(data.wind.speed * 3.6) },
                    humidity: data.main.humidity,
                    pressure: data.main.pressure,
                    description: data.weather[0].description,
                    icon: data.weather[0].icon
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching default weather:', error);
                setWeatherData({
                    temp: '22',
                    wind: { speed: '15' },
                    humidity: '65',
                    pressure: '1013',
                    description: 'No disponible',
                    icon: '01d'
                });
                setLoading(false);
            }
        };

        fetchWeatherData();
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
                            {!loading && (
                                <span className="weather-description" style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-light)',
                                    textTransform: 'capitalize',
                                    marginTop: '4px',
                                    display: 'block'
                                }}>
                                    {weatherData.description}
                                </span>
                            )}
                        </div>
                        <div className="weather-temp">
                            <div className="temp-circle">
                                {loading ? (
                                    <div className="spinner-border spinner-border-sm text-orange" role="status" style={{ color: 'var(--primary-orange)' }}>
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                ) : (
                                    <span className="temp-value">{weatherData.temp}°</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="weather-stats">
                        <div className="stat-item">
                            <i className="bi bi-wind"></i>
                            <span>{loading ? '--' : weatherData.wind.speed} km/h</span>
                        </div>
                        <div className="stat-item">
                            <i className="bi bi-droplet"></i>
                            <span>{loading ? '--' : weatherData.humidity}%</span>
                        </div>
                        <div className="stat-item">
                            <i className="bi bi-thermometer-half"></i>
                            <span>{loading ? '--' : weatherData.pressure} hPa</span>
                        </div>
                    </div>
                </div>

                <div className="growth-activity-card">
                    <div className="card-header">
                        <h3>Producción en General</h3>
                        <span className="period-badge">
                            {productionData.loading ? 'Cargando...' : `${productionData.totalProducts} Productos`}
                        </span>
                    </div>
                    <div className="growth-chart">
                        <div className="growth-line">
                            <div className="growth-point active">
                                <span className="growth-value">
                                    {productionData.loading ? '--' : `${productionData.highProduction}%`}
                                </span>
                            </div>
                            <div className="growth-point">
                                <span className="growth-value">
                                    {productionData.loading ? '--' : `${productionData.mediumProduction}%`}
                                </span>
                            </div>
                            <div className="growth-point">
                                <span className="growth-value">
                                    {productionData.loading ? '--' : `${productionData.lowProduction}%`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="growth-legend">
                        <div className="legend-item">
                            <span className="legend-dot seed"></span>
                            <span>Producción Alta ({productionData.loading ? '--' : productionData.highProduction}%)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot fruit"></span>
                            <span>Producción Media ({productionData.loading ? '--' : productionData.mediumProduction}%)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot vegetation"></span>
                            <span>Producción Baja ({productionData.loading ? '--' : productionData.lowProduction}%)</span>
                        </div>
                    </div>
                </div>

                <div className="farm-illustration ration">
                    <div className="farm-scene" style={{ width: '300px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <img className="img-fluid imagenGallina" src={agricultura} alt="Imagen de agricultura" />
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