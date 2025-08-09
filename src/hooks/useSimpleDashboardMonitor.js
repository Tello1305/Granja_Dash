import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSimpleDashboardMonitor = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchDashboardData = async () => {
        if (isLoading) return; // Evitar llamadas múltiples

        try {
            setIsLoading(true);
            const RUTAJAVA = import.meta.env.VITE_RUTAJAVA;
            
            console.log('Obteniendo datos del dashboard...');
            
            // Hacer llamadas a la API
            const [conteoRes, lotesRes, productosRes] = await Promise.all([
                axios.get(`${RUTAJAVA}/api/sumaDelSistema/conteoSistema`),
                axios.get(`${RUTAJAVA}/api/lotesDeAnimales`),
                axios.get(`${RUTAJAVA}/api/productoAnimales`)
            ]);

            const conteoData = conteoRes.data;
            const lotesData = lotesRes.data;
            const productosData = productosRes.data;

            // Procesar datos
            const totalAnimals = lotesData.reduce((sum, lote) => sum + (lote.cantidad || 0), 0);
            const totalProducts = productosData.length;
            const activeProducts = productosData.filter(p => p.estado === 'ACTIVO').length;
            const inactiveProducts = productosData.filter(p => p.estado === 'INACTIVO').length;
            const totalProductQuantity = productosData.reduce((sum, p) => sum + (p.cantidad || 0), 0);

            // Simular datos ambientales
            const temperature = (20 + Math.random() * 8).toFixed(1);
            const humidity = (60 + Math.random() * 20).toFixed(1);

            const processedData = {
                totalAnimals,
                totalProducts,
                activeProducts,
                inactiveProducts,
                totalProductQuantity,
                totalCategories: conteoData.Categoria || 0,
                totalRaces: conteoData.Raza || 0,
                avgTemperature: temperature,
                avgHumidity: humidity,
                eggProduction: Math.floor(totalAnimals * 0.7),
                feedConsumption: (totalAnimals * 0.12).toFixed(1),
                activeAlerts: inactiveProducts > 5 ? 2 : 1,
                lastUpdate: new Date().toISOString()
            };

            setDashboardData(processedData);
            setLastUpdate(new Date());
            console.log('Datos procesados:', processedData);

        } catch (error) {
            console.error('Error obteniendo datos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Efecto para cargar datos iniciales
    useEffect(() => {
        let mounted = true;
        
        const loadInitialData = async () => {
            if (mounted) {
                await fetchDashboardData();
            }
        };

        // Cargar datos después de 2 segundos
        const timeout = setTimeout(loadInitialData, 2000);

        return () => {
            mounted = false;
            clearTimeout(timeout);
        };
    }, []); // Solo se ejecuta una vez

    return {
        dashboardData,
        isLoading,
        lastUpdate,
        refreshData: fetchDashboardData
    };
};