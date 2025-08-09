import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { getFallbackResponse } from './fallbackChat';

// Inicializar Gemini con la API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Rate limiting: máximo 15 consultas por minuto (Gemini 1.5 Flash)
const RATE_LIMIT = 15; // consultas por minuto
const RATE_WINDOW = 60 * 1000; // 1 minuto en milisegundos
let requestQueue = [];

// Función para verificar y controlar rate limiting
const checkRateLimit = () => {
    const now = Date.now();
    // Filtrar requests del último minuto
    requestQueue = requestQueue.filter(timestamp => now - timestamp < RATE_WINDOW);

    if (requestQueue.length >= RATE_LIMIT) {
        const oldestRequest = Math.min(...requestQueue);
        const waitTime = RATE_WINDOW - (now - oldestRequest);
        throw new Error(`Rate limit excedido (15/min). Espera ${Math.ceil(waitTime / 1000)} segundos antes de hacer otra consulta.`);
    }

    // Agregar la nueva request
    requestQueue.push(now);
    console.log(`Consultas a Gemini 1.5 Flash en el último minuto: ${requestQueue.length}/${RATE_LIMIT}`);
};

// Función para hacer consultas controladas a Gemini
const makeControlledGeminiRequest = async (prompt) => {
    try {
        checkRateLimit();

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('API key de Gemini no configurada');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error('Error en consulta controlada a Gemini:', error);
        throw error;
    }
};

// Función para probar la conexión con Gemini
export const testGeminiConnection = async () => {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log('API Key configurada:', apiKey ? 'Sí' : 'No');
        console.log('Longitud de API Key:', apiKey?.length || 0);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('Usando modelo: gemini-1.5-flash');

        const result = await model.generateContent("Responde solo con 'Conexión exitosa' en español");
        const response = await result.response;
        const text = response.text();

        console.log('Respuesta de Gemini:', text);
        return { success: true, message: text };

    } catch (error) {
        console.error('Error en prueba de conexión:', error);
        return {
            success: false,
            error: error.message,
            details: error
        };
    }
};

export const generateDashboardSummary = async () => {
    try {
        // Verificar que la API key esté configurada
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('API key de Gemini no configurada');
        }

        console.log('Iniciando generación de resumen con Gemini...');

        // Intentar con diferentes modelos
        let model;
        try {
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        } catch (modelError) {
            console.log('Modelo gemini-1.5-flash no disponible, intentando con gemini-pro...');
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
        }

        // Simular datos del dashboard (aquí deberías obtener datos reales de tu API)
        const dashboardData = await getDashboardData();

        const prompt = `Eres un asistente inteligente para una granja avícola. Analiza los siguientes datos REALES del dashboard y genera un resumen conciso y útil en español:

📊 DATOS ACTUALES DE LA GRANJA:
• Total de animales en lotes: ${dashboardData.totalAnimals}
• Productos registrados: ${dashboardData.totalProducts} (${dashboardData.activeProducts} activos, ${dashboardData.inactiveProducts} inactivos)
• Cantidad total de productos: ${dashboardData.totalProductQuantity}
• Categorías registradas: ${dashboardData.totalCategories}
• Razas registradas: ${dashboardData.totalRaces}
• Producción estimada de huevos: ${dashboardData.eggProduction}
• Temperatura ambiente: ${dashboardData.avgTemperature}°C
• Humedad ambiente: ${dashboardData.avgHumidity}%
• Alertas activas: ${dashboardData.activeAlerts}
• Mortalidad semanal estimada: ${dashboardData.weeklyMortality}
• Consumo de alimento estimado: ${dashboardData.feedConsumption} kg
• Última actualización: ${new Date(dashboardData.lastUpdate).toLocaleString('es-ES')}

Genera un resumen de máximo 150 palabras que incluya:
1. Estado general actual de la granja
2. Análisis de los datos más relevantes
3. Alertas o recomendaciones si es necesario
4. Aspectos positivos a destacar

Mantén un tono profesional pero amigable, y usa los datos reales proporcionados.`;

        console.log('Enviando prompt a Gemini (con rate limiting)...');
        const text = await makeControlledGeminiRequest(prompt);

        console.log('Resumen generado exitosamente');
        return text;

    } catch (error) {
        console.error('Error detallado al generar resumen con Gemini:', error);

        // Proporcionar información más específica del error
        if (error.message?.includes('API_KEY_INVALID')) {
            throw new Error('API key de Gemini inválida. Verifica tu configuración.');
        } else if (error.message?.includes('QUOTA_EXCEEDED')) {
            throw new Error('Cuota de API de Gemini excedida. Intenta más tarde.');
        } else if (error.message?.includes('MODEL_NOT_FOUND')) {
            throw new Error('Modelo de Gemini no encontrado. Verifica la configuración.');
        } else {
            throw new Error(`Error de conexión con Gemini: ${error.message || 'Error desconocido'}`);
        }
    }
};

// Función para obtener datos reales del dashboard
const getDashboardData = async () => {
    try {
        const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

        // Hacer llamadas paralelas a diferentes endpoints
        const [
            conteoResponse,
            lotesResponse,
            productosResponse
        ] = await Promise.all([
            axios.get(`${RUTAJAVA}/api/sumaDelSistema/conteoSistema`),
            axios.get(`${RUTAJAVA}/api/lotesDeAnimales`),
            axios.get(`${RUTAJAVA}/api/productoAnimales`)
        ]);

        const conteoData = conteoResponse.data;
        const lotesData = lotesResponse.data;
        const productosData = productosResponse.data;

        // Calcular estadísticas reales
        const totalAnimals = lotesData.reduce((sum, lote) => sum + (lote.cantidad || 0), 0);
        const totalProducts = productosData.length;
        const totalProductQuantity = productosData.reduce((sum, producto) => sum + (producto.cantidad || 0), 0);

        // Calcular productos activos vs inactivos
        const activeProducts = productosData.filter(p => p.estado === 'ACTIVO').length;
        const inactiveProducts = productosData.filter(p => p.estado === 'INACTIVO').length;

        // Obtener datos de clima actual (simulado basado en datos reales)
        const currentDate = new Date();
        const temperature = 20 + Math.sin(currentDate.getHours() / 24 * Math.PI * 2) * 5 + Math.random() * 2;
        const humidity = 60 + Math.random() * 20;

        // Simular alertas basadas en datos reales
        let activeAlerts = 0;
        if (temperature > 28) activeAlerts++;
        if (humidity > 80) activeAlerts++;
        if (inactiveProducts > totalProducts * 0.3) activeAlerts++;

        return {
            totalAnimals,
            totalProducts,
            totalProductQuantity,
            activeProducts,
            inactiveProducts,
            totalCategories: conteoData.Categoria || 0,
            totalRaces: conteoData.Raza || 0,
            activeAlerts,
            avgTemperature: temperature.toFixed(1),
            avgHumidity: humidity.toFixed(1),
            // Simular datos adicionales basados en los reales
            eggProduction: Math.floor(totalAnimals * 0.7), // 70% de producción estimada
            weeklyMortality: Math.floor(totalAnimals * 0.01), // 1% mortalidad estimada
            feedConsumption: (totalAnimals * 0.12).toFixed(1), // 120g por animal aprox
            lastUpdate: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error obteniendo datos del dashboard:', error);

        // Datos de fallback más realistas
        return {
            totalAnimals: 0,
            totalProducts: 0,
            totalProductQuantity: 0,
            activeProducts: 0,
            inactiveProducts: 0,
            totalCategories: 0,
            totalRaces: 0,
            activeAlerts: 1,
            avgTemperature: '24.5',
            avgHumidity: '65.0',
            eggProduction: 0,
            weeklyMortality: 0,
            feedConsumption: '0.0',
            lastUpdate: new Date().toISOString(),
            error: 'No se pudieron obtener datos de la API'
        };
    }
};

// Función para generar alertas inteligentes basadas en datos específicos
export const generateSmartAlert = async (alertType, data) => {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('API key de Gemini no configurada');
        }

        let model;
        try {
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        } catch (modelError) {
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
        }

        let prompt = '';

        switch (alertType) {
            case 'temperature':
                prompt = `La temperatura en el galpón es de ${data.temperature}°C. Si está fuera del rango normal (18-26°C), genera una alerta breve y una recomendación en español.`;
                break;
            case 'mortality':
                prompt = `Se registraron ${data.deaths} muertes hoy. Si es un número preocupante, genera una alerta y recomendaciones en español.`;
                break;
            case 'production':
                prompt = `La producción de huevos hoy fue de ${data.eggs} huevos, comparado con el promedio de ${data.average}. Analiza si requiere atención y genera una alerta en español si es necesario.`;
                break;
            default:
                prompt = `Analiza esta situación en la granja: ${JSON.stringify(data)} y genera una alerta si es necesario, en español.`;
        }

        return await makeControlledGeminiRequest(prompt);

    } catch (error) {
        console.error('Error generando alerta inteligente:', error);
        if (error.message?.includes('Rate limit')) {
            return `Alerta: ${alertType} - Rate limit alcanzado. Se detectó una situación que requiere atención.`;
        }
        return 'Se detectó una situación que requiere atención en la granja.';
    }
};

// Función para obtener datos específicos de un área de la granja
export const getDashboardDataByArea = async (area) => {
    try {
        const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

        switch (area) {
            case 'animals':
                const lotesResponse = await axios.get(`${RUTAJAVA}/api/lotesDeAnimales`);
                return {
                    totalLotes: lotesResponse.data.length,
                    totalAnimals: lotesResponse.data.reduce((sum, lote) => sum + (lote.cantidad || 0), 0),
                    lotesPorRaza: lotesResponse.data.reduce((acc, lote) => {
                        const raza = lote.razaNombre || 'Sin raza';
                        acc[raza] = (acc[raza] || 0) + lote.cantidad;
                        return acc;
                    }, {}),
                    fechaUltimaCompra: lotesResponse.data.length > 0 ?
                        Math.max(...lotesResponse.data.map(l => new Date(l.fecha).getTime())) : null
                };

            case 'products':
                const productosResponse = await axios.get(`${RUTAJAVA}/api/productoAnimales`);
                return {
                    totalProducts: productosResponse.data.length,
                    activeProducts: productosResponse.data.filter(p => p.estado === 'ACTIVO').length,
                    inactiveProducts: productosResponse.data.filter(p => p.estado === 'INACTIVO').length,
                    totalQuantity: productosResponse.data.reduce((sum, p) => sum + (p.cantidad || 0), 0),
                    productosPorRaza: productosResponse.data.reduce((acc, producto) => {
                        const raza = producto.nombreRaza || 'Sin raza';
                        acc[raza] = (acc[raza] || 0) + producto.cantidad;
                        return acc;
                    }, {})
                };

            case 'categories':
                const conteoResponse = await axios.get(`${RUTAJAVA}/api/sumaDelSistema/conteoSistema`);
                return conteoResponse.data;

            default:
                return await getDashboardData();
        }
    } catch (error) {
        console.error(`Error obteniendo datos de ${area}:`, error);
        return null;
    }
};

// Función para generar alertas específicas basadas en datos reales
export const generateRealTimeAlert = async (alertData) => {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('API key de Gemini no configurada');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Analiza esta situación REAL en la granja avícola y genera una alerta específica en español:

DATOS DE LA SITUACIÓN:
${JSON.stringify(alertData, null, 2)}

Genera una alerta de máximo 100 palabras que incluya:
1. Descripción clara del problema o situación
2. Nivel de urgencia (Alto/Medio/Bajo)
3. Recomendación específica de acción
4. Posibles consecuencias si no se actúa

Mantén un tono profesional y directo.`;

        return await makeControlledGeminiRequest(prompt);

    } catch (error) {
        console.error('Error generando alerta en tiempo real:', error);
        if (error.message?.includes('Rate limit')) {
            return `Alerta: Rate limit alcanzado. Se detectó una situación que requiere atención en ${alertData.area || 'la granja'}.`;
        }
        return `Alerta: Se detectó una situación que requiere atención en ${alertData.area || 'la granja'}. Revisa los datos y toma las medidas necesarias.`;
    }
};
// Función para chat con IA sobre el sistema de granja
export const chatWithAI = async (userQuestion, dashboardData) => {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.log('API key no configurada, usando respuestas predefinidas');
            return getFallbackResponse(userQuestion, dashboardData);
        }

        console.log('Iniciando chat con IA...');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('Usando modelo: gemini-1.5-flash');

        const systemContext = dashboardData ? `
CONTEXTO ACTUAL DEL SISTEMA DE GRANJA:
• Total de animales: ${dashboardData.totalAnimals}
• Productos registrados: ${dashboardData.totalProducts} (${dashboardData.activeProducts} activos)
• Categorías: ${dashboardData.totalCategories}
• Razas: ${dashboardData.totalRaces}
• Temperatura: ${dashboardData.avgTemperature}°C
• Humedad: ${dashboardData.avgHumidity}%
• Producción estimada: ${dashboardData.eggProduction} huevos
• Consumo de alimento: ${dashboardData.feedConsumption} kg
• Alertas activas: ${dashboardData.activeAlerts}
        ` : 'No hay datos del sistema disponibles actualmente.';

        const prompt = `Eres un asistente especializado en sistemas de gestión de granjas avícolas. Tu función es ayudar ÚNICAMENTE con temas relacionados con:
- Gestión de animales y lotes
- Productos y inventario
- Análisis de datos de la granja
- Recomendaciones de mejora
- Interpretación de métricas del dashboard
- Buenas prácticas avícolas
- Optimización de recursos

${systemContext}

PREGUNTA DEL USUARIO: ${userQuestion}

INSTRUCCIONES:
1. Responde SOLO sobre temas relacionados con el sistema de granja
2. Si la pregunta no es sobre la granja, responde: "Solo puedo ayudarte con temas relacionados al sistema de gestión de tu granja avícola"
3. Usa los datos actuales del sistema cuando sea relevante
4. Mantén respuestas concisas (máximo 200 palabras)
5. Sé profesional pero amigable
6. Proporciona recomendaciones prácticas cuando sea apropiado

Responde en español:`;

        console.log('Enviando prompt a Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Respuesta recibida de Gemini');
        return text;

    } catch (error) {
        console.error('Error detallado en chat con IA:', error);

        // Si hay error de cuota o cualquier problema con Gemini, usar fallback
        if (error.message?.includes('exceeded your current quota') ||
            error.message?.includes('QUOTA_EXCEEDED') ||
            error.message?.includes('429')) {

            console.log('Cuota excedida, usando respuestas predefinidas');
            return `🤖 **Modo Offline - Cuota Agotada**

Has usado las 50 consultas gratuitas de Gemini hoy. Ahora uso respuestas predefinidas basadas en tu pregunta.

${getFallbackResponse(userQuestion, dashboardData)}

💡 **Para recuperar el chat con IA:**
• Espera hasta mañana (se restablece automáticamente)
• O actualiza tu plan en [Google AI Studio](https://makersuite.google.com/)`;
        }

        if (error.message?.includes('API_KEY_INVALID')) {
            return getFallbackResponse(userQuestion, dashboardData);
        } else if (error.message?.includes('SAFETY')) {
            return 'No puedo responder a esa pregunta. Por favor, haz una consulta relacionada con la gestión de tu granja.';
        } else {
            console.log('Error de conexión, usando respuestas predefinidas');
            return `🤖 **Modo Offline - Sin Conexión**

No pude conectar con Gemini AI, pero puedo ayudarte con respuestas predefinidas:

${getFallbackResponse(userQuestion, dashboardData)}`;
        }
    }
};

// Función para obtener sugerencias de preguntas basadas en los datos
export const getSuggestedQuestions = (dashboardData) => {
    const suggestions = [
        "¿Cómo está el rendimiento general de mi granja?",
        "¿Qué hacer con los productos inactivos?",
        "¿Cómo mejorar la producción de huevos?",
        "¿La temperatura está bien para mis aves?",
        "¿Cómo optimizar la alimentación?",
        "¿Cómo organizar mejor mis lotes?",
        "¿Qué razas son mejores para mi granja?",
        "¿Cómo mantener un buen ambiente?"
    ];

    // Personalizar sugerencias basadas en datos
    const personalizedSuggestions = [];

    if (dashboardData) {
        if (dashboardData.activeAlerts > 0) {
            personalizedSuggestions.push("¿Qué significan mis alertas activas?");
        }

        if (dashboardData.inactiveProducts > 5) {
            personalizedSuggestions.push("¿Por qué tengo tantos productos inactivos?");
        }

        if (dashboardData.totalAnimals > 1000) {
            personalizedSuggestions.push("¿Cómo gestionar eficientemente una granja grande?");
        }

        if (parseFloat(dashboardData.avgTemperature) > 28) {
            personalizedSuggestions.push("¿La temperatura está muy alta para mis aves?");
        }
    }

    // Combinar sugerencias personalizadas con las generales
    const allSuggestions = [...personalizedSuggestions, ...suggestions];

    // Retornar 6 sugerencias aleatorias
    return allSuggestions.sort(() => 0.5 - Math.random()).slice(0, 6);
};