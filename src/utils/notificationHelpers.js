// Helpers para crear diferentes tipos de notificaciones

export const createSuccessNotification = (title, message) => ({
    type: 'success',
    title,
    message,
    priority: 'low'
});

export const createErrorNotification = (title, message) => ({
    type: 'error',
    title,
    message,
    priority: 'high'
});

export const createWarningNotification = (title, message) => ({
    type: 'alert',
    title,
    message,
    priority: 'medium'
});

export const createInfoNotification = (title, message) => ({
    type: 'info',
    title,
    message,
    priority: 'low'
});

// Ejemplos de notificaciones específicas para la granja
export const farmNotifications = {
    highTemperature: (temp) => createWarningNotification(
        'Temperatura Alta',
        `La temperatura del galpón ha alcanzado ${temp}°C. Se recomienda revisar la ventilación.`
    ),
    
    lowEggProduction: (current, expected) => createWarningNotification(
        'Producción Baja',
        `Producción de huevos: ${current} (esperado: ${expected}). Revisar alimentación y salud de las aves.`
    ),
    
    highMortality: (deaths) => createErrorNotification(
        'Mortalidad Alta',
        `Se registraron ${deaths} muertes hoy. Se requiere atención veterinaria inmediata.`
    ),
    
    feedLow: (remaining) => createWarningNotification(
        'Alimento Bajo',
        `Quedan ${remaining}kg de alimento. Programar reabastecimiento pronto.`
    ),
    
    systemMaintenance: () => createInfoNotification(
        'Mantenimiento Programado',
        'El sistema estará en mantenimiento mañana de 2:00 AM a 4:00 AM.'
    ),
    
    dataBackup: () => createSuccessNotification(
        'Respaldo Completado',
        'Los datos se han respaldado exitosamente en la nube.'
    )
};