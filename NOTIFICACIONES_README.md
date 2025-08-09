# Sistema de Notificaciones Inteligentes con Gemini AI

## 🚀 Características

- **Notificaciones inteligentes** generadas por Gemini AI
- **Resúmenes automáticos** del dashboard cada 30 minutos
- **Alertas personalizadas** basadas en datos de la granja
- **Interfaz moderna** con indicadores visuales
- **Contexto global** para usar desde cualquier componente

## 📋 Configuración

### 1. API Key de Gemini

Agrega tu API key de Gemini en el archivo `.env`:

```env
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

### 2. Obtener API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Cópiala y pégala en tu archivo `.env`

## 🎯 Uso Básico

### Desde cualquier componente:

```jsx
import { useNotificationContext } from '../contexts/NotificationContext';

function MiComponente() {
    const { addNotification, generateAlert } = useNotificationContext();
    
    const handleSuccess = () => {
        addNotification({
            type: 'success',
            title: 'Operación Exitosa',
            message: 'Los datos se guardaron correctamente',
            priority: 'low'
        });
    };
    
    const handleTemperatureAlert = () => {
        generateAlert('temperature', { temperature: 28 });
    };
    
    return (
        <div>
            <button onClick={handleSuccess}>Guardar</button>
            <button onClick={handleTemperatureAlert}>Alerta Temperatura</button>
        </div>
    );
}
```

### Usando helpers predefinidos:

```jsx
import { useNotificationContext } from '../contexts/NotificationContext';
import { farmNotifications } from '../utils/notificationHelpers';

function Dashboard() {
    const { addNotification } = useNotificationContext();
    
    const checkTemperature = (temp) => {
        if (temp > 26) {
            addNotification(farmNotifications.highTemperature(temp));
        }
    };
}
```

## 🔧 Tipos de Notificaciones

### Tipos disponibles:
- `success` - Verde, para operaciones exitosas
- `error` - Rojo, para errores críticos
- `alert` - Naranja, para advertencias
- `info` - Azul, para información general
- `summary` - Azul, para resúmenes de IA

### Prioridades:
- `high` - Rojo, requiere atención inmediata
- `medium` - Azul, importante pero no crítico
- `low` - Verde, informativo

## 🤖 Funciones de IA

### Resumen Automático
- Se genera cada 30 minutos automáticamente
- Analiza datos del dashboard
- Proporciona insights y recomendaciones

### Alertas Inteligentes
- `temperature` - Analiza temperatura del galpón
- `mortality` - Evalúa mortalidad diaria
- `production` - Compara producción de huevos

## 🎨 Personalización

### Estilos CSS
Los estilos están en `src/assets/css/notifications.css` y puedes personalizarlos:

```css
.notification-item.priority-high {
    border-left-color: #dc3545;
}

.notification-item.priority-medium {
    border-left-color: #007bff;
}
```

### Configurar Intervalos
En `src/hooks/useNotifications.js`:

```js
// Cambiar intervalo de resúmenes (en milisegundos)
const interval = setInterval(() => {
    generateSummary();
}, 15 * 60 * 1000); // 15 minutos
```

## 📱 Responsive

El componente es completamente responsive:
- Desktop: Panel completo con todas las funciones
- Tablet: Panel adaptado
- Mobile: Panel optimizado para pantallas pequeñas

## 🔍 Debugging

Para debuggear problemas:

1. **API Key**: Verifica que esté correctamente configurada
2. **Console**: Revisa errores en la consola del navegador
3. **Network**: Verifica llamadas a la API de Gemini
4. **Estado**: Usa React DevTools para inspeccionar el estado

## 🚨 Manejo de Errores

El sistema maneja automáticamente:
- Errores de conexión a Gemini
- API key inválida o expirada
- Límites de rate limiting
- Errores de red

## 📊 Integración con Dashboard

Para conectar con datos reales, modifica `src/services/geminiService.js`:

```js
const getDashboardData = async () => {
    try {
        // Reemplaza con llamadas reales a tu API
        const response = await fetch('/api/dashboard-data');
        return await response.json();
    } catch (error) {
        // Datos de fallback
        return defaultData;
    }
};
```

## 🎯 Próximas Mejoras

- [ ] Notificaciones push del navegador
- [ ] Historial de notificaciones
- [ ] Filtros por tipo y prioridad
- [ ] Configuración de intervalos por usuario
- [ ] Integración con WhatsApp/Email
- [ ] Análisis predictivo con IA

¡El sistema está listo para usar! 🎉
##
 🤖 Chat con IA Integrado

### Nueva Funcionalidad: Consultar IA
Ahora el sistema incluye un chat inteligente donde puedes hacer preguntas específicas sobre tu granja:

#### Características del Chat:
- **Respuestas contextualizadas** basadas en los datos actuales de tu granja
- **Preguntas sugeridas** personalizadas según tu situación
- **Interfaz conversacional** fácil de usar
- **Restricción temática** - solo responde sobre temas de la granja

#### Ejemplos de preguntas que puedes hacer:
- "¿Cómo está el rendimiento general de mi granja?"
- "¿Qué puedo hacer para mejorar la producción de huevos?"
- "¿Los niveles de temperatura y humedad están bien?"
- "¿Cuántos productos inactivos tengo y por qué es importante?"
- "¿Cómo optimizar el consumo de alimento?"
- "¿Qué significan las alertas activas?"

#### Cómo usar el Chat:
1. Haz clic en el ícono de notificaciones
2. Selecciona la pestaña "Consultar IA"
3. Escribe tu pregunta o selecciona una sugerida
4. Recibe respuestas personalizadas basadas en tus datos

#### Preguntas Inteligentes:
El sistema genera preguntas sugeridas basadas en:
- Número de alertas activas
- Cantidad de productos inactivos
- Temperatura actual
- Tamaño de la granja
- Otros indicadores relevantes

¡El chat está diseñado para ser tu asistente personal de granja! 🐔✨