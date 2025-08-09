import { useState, useEffect, useCallback } from 'react';
import { getDashboardDataByArea, generateRealTimeAlert } from '../services/geminiService';

export const useDashboardMonitor = (onAlert) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [lastCheck, setLastCheck] = useState(null);

    // Función para verificar cambios significativos
    const checkForAlerts = useCallback(async (newData, oldData) => {
        if (!oldData || !onAlert) return;

        const alerts = [];

        // Verificar cambios en animales
        if (newData.totalAnimals !== oldData.totalAnimals) {
            const difference = newData.totalAnimals - oldData.totalAnimals;
            if (Math.abs(difference) > 10) { // Cambio significativo
                alerts.push({
                    type: 'animals',
                    area: 'Lotes de Animales',
                    change: difference,
                    current: newData.totalAnimals,
                    previous: oldData.totalAnimals,
                    severity: Math.abs(difference) > 50 ? 'high' : 'medium'
                });
            }
        }

        // Verificar cambios en productos
        if (newData.totalProducts !== oldData.totalProducts) {
            const difference = newData.totalProducts - oldData.totalProducts;
            alerts.push({
                type: 'products',
                area: 'Productos',
                change: difference,
                current: newData.totalProducts,
                previous: oldData.totalProducts,
                severity: 'low'
            });
        }

        // Verificar productos inactivos
        if (newData.inactiveProducts > oldData.inactiveProducts) {
            const difference = newData.inactiveProducts - oldData.inactiveProducts;
            alerts.push({
                type: 'inactive_products',
                area: 'Productos Inactivos',
                change: difference,
                current: newData.inactiveProducts,
                previous: oldData.inactiveProducts,
                severity: difference > 5 ? 'high' : 'medium'
            });
        }

        // Verificar temperatura
        const tempDiff = Math.abs(parseFloat(newData.avgTemperature) - parseFloat(oldData.avgTemperature));
        if (tempDiff > 3) {
            alerts.push({
                type: 'temperature',
                area: 'Temperatura',
                change: parseFloat(newData.avgTemperature) - parseFloat(oldData.avgTemperature),
                current: newData.avgTemperature,
                previous: oldData.avgTemperature,
                severity: tempDiff > 5 ? 'high' : 'medium'
            });
        }

        // Generar alertas con IA
        for (const alert of alerts) {
            try {
                const aiAlert = await generateRealTimeAlert(alert);
                onAlert({
                    type: 'alert',
                    title: `Cambio Detectado: ${alert.area}`,
                    message: aiAlert,
                    priority: alert.severity,
                    data: alert
                });
            } catch (error) {
                console.error('Error generando alerta IA:', error);
                // Alerta de fallback
                onAlert({
                    type: 'alert',
                    title: `Cambio en ${alert.area}`,
                    message: `Se detectó un cambio de ${alert.change > 0 ? '+' : ''}${alert.change} en ${alert.area.toLowerCase()}. Valor actual: ${alert.current}`,
                    priority: alert.severity,
                    data: alert
                });
            }
        }
    }, [onAlert]);

    // Función para obtener datos actuales
    const fetchCurrentData = useCallback(async () => {
        // Evitar llamadas múltiples simultáneas
        if (isMonitoring) {
            console.log('Ya hay una consulta en progreso, saltando...');
            return dashboardData;
        }

        try {
            setIsMonitoring(true);
            console.log('Obteniendo datos del dashboard...');
            
            const [animalsData, productsData, categoriesData] = await Promise.all([
                getDashboardDataByArea('animals'),
                getDashboardDataByArea('products'),
                getDashboardDataByArea('categories')
            ]);

            const currentData = {
                ...animalsData,
                ...productsData,
                ...categoriesData,
                timestamp: new Date().toISOString()
            };

            // Verificar alertas solo si hay cambios significativos
            if (dashboardData && JSON.stringify(currentData) !== JSON.stringify(dashboardData)) {
                console.log('Datos cambiaron, verificando alertas...');
                await checkForAlerts(currentData, dashboardData);
            }

            setDashboardData(currentData);
            setLastCheck(new Date());
            console.log('Datos del dashboard actualizados');
            
            return currentData;
        } catch (error) {
            console.error('Error monitoreando dashboard:', error);
            if (onAlert) {
                onAlert({
                    type: 'error',
                    title: 'Error de Monitoreo',
                    message: 'No se pudieron obtener los datos actuales del dashboard',
                    priority: 'medium'
                });
            }
        } finally {
            setIsMonitoring(false);
        }
    }, [isMonitoring, dashboardData, checkForAlerts, onAlert]);

    // Iniciar monitoreo automático
    useEffect(() => {
        // Obtener datos iniciales solo una vez
        let mounted = true;
        
        const initializeData = async () => {
            if (mounted) {
                await fetchCurrentData();
            }
        };
        
        initializeData();

        // Configurar monitoreo cada 10 minutos (reducido la frecuencia)
        const interval = setInterval(() => {
            if (mounted) {
                fetchCurrentData();
            }
        }, 10 * 60 * 1000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []); // Dependencias vacías para evitar bucles

    return {
        dashboardData,
        isMonitoring,
        lastCheck,
        refreshData: fetchCurrentData
    };
};