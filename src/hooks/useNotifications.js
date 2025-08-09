import { useState, useEffect, useCallback } from 'react';
import { generateSmartAlert } from '../services/geminiService';
import { generateRealDataNotifications } from '../services/realDataNotifications';
import { useSimpleDashboardMonitor } from './useSimpleDashboardMonitor';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);



    // Agregar nueva notificación
    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now() + Math.random(),
            timestamp: new Date(),
            read: false,
            priority: 'medium',
            ...notification
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Mantener máximo 20
        setUnreadCount(prev => prev + 1);
        
        return newNotification.id;
    }, []);

    // Integrar monitor de dashboard simplificado
    const { dashboardData, isLoading: isMonitoring, lastUpdate: lastCheck, refreshData } = useSimpleDashboardMonitor();

    // Marcar como leída
    const markAsRead = useCallback((id) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === id && !notif.read ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    // Marcar todas como leídas
    const markAllAsRead = useCallback(() => {
        const unreadNotifications = notifications.filter(n => !n.read);
        setNotifications(prev => 
            prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
    }, [notifications]);

    // Limpiar todas las notificaciones
    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    // Función para recargar notificaciones de datos reales
    const refreshNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log('Recargando notificaciones...');
            const realNotifications = await generateRealDataNotifications();
            
            if (realNotifications.length > 0) {
                realNotifications.forEach(notification => {
                    addNotification(notification);
                });
                
                addNotification({
                    type: 'success',
                    title: 'Notificaciones Actualizadas',
                    message: `Se cargaron ${realNotifications.length} notificaciones basadas en los datos actuales del sistema.`,
                    priority: 'low'
                });
            } else {
                addNotification({
                    type: 'info',
                    title: 'Sin Cambios',
                    message: 'No hay cambios nuevos en el sistema desde la última verificación.',
                    priority: 'low'
                });
            }
        } catch (error) {
            console.error('Error recargando notificaciones:', error);
            addNotification({
                type: 'error',
                title: 'Error de Actualización',
                message: 'No se pudieron cargar las notificaciones. Verifica tu conexión.',
                priority: 'medium'
            });
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    // Generar alerta inteligente
    const generateAlert = useCallback(async (alertType, data) => {
        try {
            const alertMessage = await generateSmartAlert(alertType, data);
            addNotification({
                type: 'alert',
                title: `Alerta: ${alertType}`,
                message: alertMessage,
                priority: 'high'
            });
        } catch (error) {
            console.error('Error generando alerta:', error);
            addNotification({
                type: 'error',
                title: 'Error en Alerta',
                message: 'No se pudo generar la alerta inteligente.',
                priority: 'medium'
            });
        }
    }, [addNotification]);

    // Generar notificaciones basadas en datos reales
    const generateRealNotifications = useCallback(async () => {
        try {
            const realNotifications = await generateRealDataNotifications();
            realNotifications.forEach(notification => {
                addNotification(notification);
            });
        } catch (error) {
            console.error('Error generando notificaciones reales:', error);
        }
    }, [addNotification]);

    // Configurar notificaciones automáticas (solo datos reales)
    useEffect(() => {
        let mounted = true;
        
        // Generar notificaciones iniciales después de 3 segundos
        const initialTimeout = setTimeout(() => {
            if (mounted) {
                generateRealNotifications();
            }
        }, 3000);

        // Configurar intervalo para notificaciones de datos reales cada 2 minutos
        const realDataInterval = setInterval(() => {
            if (mounted) {
                generateRealNotifications();
            }
        }, 2 * 60 * 1000);

        return () => {
            mounted = false;
            clearTimeout(initialTimeout);
            clearInterval(realDataInterval);
        };
    }, []); // Dependencias vacías para evitar bucles

    // Las notificaciones ahora se generan solo con datos reales del sistema

    return {
        notifications,
        unreadCount,
        isLoading: isLoading || isMonitoring,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        refreshNotifications,
        generateAlert,
        dashboardData,
        lastCheck,
        refreshData
    };
};