import axios from 'axios';

const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;

// Cache para almacenar datos anteriores y comparar cambios
let previousData = null;
let lastDataFetch = null;

// Función para obtener datos actuales del sistema
export const getCurrentSystemData = async () => {
    try {
        const [conteoRes, lotesRes, productosRes] = await Promise.all([
            axios.get(`${RUTAJAVA}/api/sumaDelSistema/conteoSistema`),
            axios.get(`${RUTAJAVA}/api/lotesDeAnimales`),
            axios.get(`${RUTAJAVA}/api/productoAnimales`)
        ]);

        const conteoData = conteoRes.data;
        const lotesData = lotesRes.data;
        const productosData = productosRes.data;

        // Procesar datos
        const currentData = {
            totalAnimals: lotesData.reduce((sum, lote) => sum + (lote.cantidad || 0), 0),
            totalLotes: lotesData.length,
            totalProducts: productosData.length,
            activeProducts: productosData.filter(p => p.estado === 'ACTIVO').length,
            inactiveProducts: productosData.filter(p => p.estado === 'INACTIVO').length,
            totalProductQuantity: productosData.reduce((sum, p) => sum + (p.cantidad || 0), 0),
            totalCategories: conteoData.Categoria || 0,
            totalRaces: conteoData.Raza || 0,
            timestamp: new Date(),
            
            // Datos adicionales para análisis
            lotesData: lotesData,
            productosData: productosData,
            
            // Análisis por fecha (productos/lotes creados hoy)
            productsCreatedToday: productosData.filter(p => {
                const createdDate = new Date(p.fecha);
                const today = new Date();
                return createdDate.toDateString() === today.toDateString();
            }).length,
            
            lotesCreatedToday: lotesData.filter(l => {
                const createdDate = new Date(l.fecha);
                const today = new Date();
                return createdDate.toDateString() === today.toDateString();
            }).length,
            
            // Análisis de esta semana
            productsCreatedThisWeek: productosData.filter(p => {
                const createdDate = new Date(p.fecha);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return createdDate >= weekAgo;
            }).length,
            
            lotesCreatedThisWeek: lotesData.filter(l => {
                const createdDate = new Date(l.fecha);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return createdDate >= weekAgo;
            }).length
        };

        return currentData;
    } catch (error) {
        console.error('Error obteniendo datos del sistema:', error);
        return null;
    }
};

// Función para generar notificaciones basadas en cambios reales
export const generateRealDataNotifications = async () => {
    const currentData = await getCurrentSystemData();
    if (!currentData) return [];

    const notifications = [];
    const now = new Date();

    // Si es la primera vez, solo mostrar estado actual
    if (!previousData) {
        // Notificación de bienvenida con datos actuales
        notifications.push({
            type: 'info',
            title: 'Dashboard Cargado',
            message: `Sistema iniciado: ${currentData.totalAnimals} animales en ${currentData.totalLotes} lotes, ${currentData.totalProducts} productos (${currentData.activeProducts} activos), ${currentData.totalCategories} categorías.`,
            priority: 'low',
            timestamp: now
        });

        // Notificaciones de actividad del día
        if (currentData.productsCreatedToday > 0) {
            notifications.push({
                type: 'success',
                title: 'Productos Creados Hoy',
                message: `Se han registrado ${currentData.productsCreatedToday} nuevos productos hoy.`,
                priority: 'low',
                timestamp: now
            });
        }

        if (currentData.lotesCreatedToday > 0) {
            notifications.push({
                type: 'success',
                title: 'Lotes Registrados Hoy',
                message: `Se han creado ${currentData.lotesCreatedToday} nuevos lotes de animales hoy, sumando ${currentData.lotesData.filter(l => {
                    const createdDate = new Date(l.fecha);
                    const today = new Date();
                    return createdDate.toDateString() === today.toDateString();
                }).reduce((sum, l) => sum + (l.cantidad || 0), 0)} animales.`,
                priority: 'low',
                timestamp: now
            });
        }

        // Resumen de actividad semanal
        if (currentData.productsCreatedThisWeek > 0 || currentData.lotesCreatedThisWeek > 0) {
            notifications.push({
                type: 'info',
                title: 'Actividad de la Semana',
                message: `Esta semana: ${currentData.productsCreatedThisWeek} productos y ${currentData.lotesCreatedThisWeek} lotes registrados. Mantén el buen ritmo de trabajo.`,
                priority: 'low',
                timestamp: now
            });
        }

        // Alertas si hay productos inactivos
        if (currentData.inactiveProducts > 0) {
            const percentage = ((currentData.inactiveProducts / currentData.totalProducts) * 100).toFixed(1);
            notifications.push({
                type: 'alert',
                title: 'Productos Inactivos',
                message: `${currentData.inactiveProducts} de ${currentData.totalProducts} productos están inactivos (${percentage}%). Revisa su estado para optimizar el inventario.`,
                priority: currentData.inactiveProducts > 5 ? 'high' : 'medium',
                timestamp: now
            });
        }

        // Notificación de estado general positivo
        if (currentData.inactiveProducts === 0 && currentData.totalProducts > 0) {
            notifications.push({
                type: 'success',
                title: 'Inventario Óptimo',
                message: `Todos los ${currentData.totalProducts} productos están activos. El inventario se encuentra en estado óptimo.`,
                priority: 'low',
                timestamp: now
            });
        }

    } else {
        // Comparar con datos anteriores para detectar cambios
        
        // Cambios en animales
        if (currentData.totalAnimals !== previousData.totalAnimals) {
            const difference = currentData.totalAnimals - previousData.totalAnimals;
            const percentage = ((difference / previousData.totalAnimals) * 100).toFixed(1);
            
            notifications.push({
                type: difference > 0 ? 'success' : 'alert',
                title: difference > 0 ? 'Animales Aumentaron' : 'Animales Disminuyeron',
                message: `Los animales ${difference > 0 ? 'aumentaron' : 'disminuyeron'} en ${Math.abs(difference)} unidades (${Math.abs(percentage)}%). Total actual: ${currentData.totalAnimals}`,
                priority: Math.abs(percentage) > 10 ? 'high' : 'medium',
                timestamp: now
            });
        }

        // Cambios en productos
        if (currentData.totalProducts !== previousData.totalProducts) {
            const difference = currentData.totalProducts - previousData.totalProducts;
            const changeType = difference > 0 ? 'agregaron' : 'eliminaron';
            const productWord = Math.abs(difference) === 1 ? 'producto' : 'productos';
            
            notifications.push({
                type: difference > 0 ? 'success' : 'info',
                title: difference > 0 ? 'Productos Agregados' : 'Productos Eliminados',
                message: `Se ${changeType} ${Math.abs(difference)} ${productWord}. Inventario actual: ${currentData.totalProducts} productos (${currentData.activeProducts} activos).`,
                priority: 'low',
                timestamp: now
            });
        }

        // Cambios en productos activos/inactivos
        if (currentData.activeProducts !== previousData.activeProducts) {
            const difference = currentData.activeProducts - previousData.activeProducts;
            
            notifications.push({
                type: difference > 0 ? 'success' : 'alert',
                title: difference > 0 ? 'Productos Activados' : 'Productos Desactivados',
                message: `${Math.abs(difference)} productos fueron ${difference > 0 ? 'activados' : 'desactivados'}. Activos: ${currentData.activeProducts}`,
                priority: difference < 0 ? 'medium' : 'low',
                timestamp: now
            });
        }

        // Cambios en lotes
        if (currentData.totalLotes !== previousData.totalLotes) {
            const difference = currentData.totalLotes - previousData.totalLotes;
            
            notifications.push({
                type: difference > 0 ? 'success' : 'info',
                title: difference > 0 ? 'Nuevos Lotes' : 'Lotes Eliminados',
                message: `Se ${difference > 0 ? 'crearon' : 'eliminaron'} ${Math.abs(difference)} lotes. Total: ${currentData.totalLotes}`,
                priority: 'low',
                timestamp: now
            });
        }

        // Cambios en categorías
        if (currentData.totalCategories !== previousData.totalCategories) {
            const difference = currentData.totalCategories - previousData.totalCategories;
            
            notifications.push({
                type: difference > 0 ? 'success' : 'info',
                title: difference > 0 ? 'Nuevas Categorías' : 'Categorías Eliminadas',
                message: `Se ${difference > 0 ? 'agregaron' : 'eliminaron'} ${Math.abs(difference)} categorías. Total: ${currentData.totalCategories}`,
                priority: 'low',
                timestamp: now
            });
        }

        // Cambios en razas
        if (currentData.totalRaces !== previousData.totalRaces) {
            const difference = currentData.totalRaces - previousData.totalRaces;
            const raceWord = Math.abs(difference) === 1 ? 'raza' : 'razas';
            
            notifications.push({
                type: difference > 0 ? 'success' : 'info',
                title: difference > 0 ? 'Nuevas Razas Registradas' : 'Razas Eliminadas',
                message: `Se ${difference > 0 ? 'registraron' : 'eliminaron'} ${Math.abs(difference)} ${raceWord}. Diversidad actual: ${currentData.totalRaces} razas disponibles.`,
                priority: 'low',
                timestamp: now
            });
        }

        // Notificación especial si hay buena diversidad
        if (currentData.totalRaces >= 5 && (!previousData || previousData.totalRaces < 5)) {
            notifications.push({
                type: 'success',
                title: 'Buena Diversidad Genética',
                message: `Tu granja cuenta con ${currentData.totalRaces} razas diferentes, lo que favorece la diversidad genética y reduce riesgos.`,
                priority: 'low',
                timestamp: now
            });
        }
    }

    // Actualizar datos anteriores
    previousData = { ...currentData };
    lastDataFetch = now;

    return notifications;
};

// Función para generar notificaciones de resumen periódico (sin IA)
export const generatePeriodicSummary = async () => {
    const currentData = await getCurrentSystemData();
    if (!currentData) return null;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    // Estado de eficiencia
    const efficiency = currentData.totalProducts > 0 ? 
        ((currentData.activeProducts / currentData.totalProducts) * 100).toFixed(1) : 0;

    // Resumen basado en datos reales
    let summaryMessage = `📊 Estado actual (${timeStr}): `;
    summaryMessage += `${currentData.totalAnimals} animales distribuidos en ${currentData.totalLotes} lotes. `;
    summaryMessage += `Inventario: ${currentData.activeProducts}/${currentData.totalProducts} productos activos (${efficiency}% eficiencia). `;
    
    // Diversidad
    summaryMessage += `Diversidad: ${currentData.totalCategories} categorías y ${currentData.totalRaces} razas. `;
    
    // Estado general
    if (currentData.inactiveProducts === 0) {
        summaryMessage += `✅ Sistema optimizado - todos los productos activos.`;
    } else if (currentData.inactiveProducts <= 2) {
        summaryMessage += `⚠️ ${currentData.inactiveProducts} productos requieren revisión.`;
    } else {
        summaryMessage += `🔴 ${currentData.inactiveProducts} productos inactivos - requiere atención urgente.`;
    }

    return {
        type: 'summary',
        title: 'Estado del Sistema',
        message: summaryMessage,
        priority: currentData.inactiveProducts > 5 ? 'high' : 'medium',
        timestamp: now
    };
};

// Función para obtener estadísticas detalladas
export const getDetailedStats = async () => {
    const currentData = await getCurrentSystemData();
    if (!currentData) return null;

    return {
        current: currentData,
        previous: previousData,
        lastUpdate: lastDataFetch,
        hasChanges: previousData !== null
    };
};