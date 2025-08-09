// Sistema de chat con respuestas predefinidas cuando Gemini no está disponible

export const fallbackChatResponses = {
    // Preguntas sobre rendimiento general
    'rendimiento|performance|como esta|estado general|resumen': {
        response: (data) => `Según los datos actuales de tu granja:

📊 **Estado General:**
• ${data?.totalAnimals || 0} animales en ${data?.totalLotes || 0} lotes
• ${data?.activeProducts || 0} productos activos de ${data?.totalProducts || 0} totales
• ${data?.totalCategories || 0} categorías y ${data?.totalRaces || 0} razas registradas

${data?.inactiveProducts > 0 ? 
    `⚠️ **Atención:** ${data.inactiveProducts} productos inactivos requieren revisión.` : 
    '✅ **Excelente:** Todos los productos están activos.'
}

**Recomendación:** ${data?.inactiveProducts > 5 ? 
    'Prioriza la activación de productos inactivos para optimizar el inventario.' : 
    'Mantén el buen estado actual del sistema.'
}`
    },

    // Preguntas sobre productos inactivos
    'productos inactivos|inactivos|desactivados': {
        response: (data) => `📦 **Productos Inactivos:**

Actualmente tienes ${data?.inactiveProducts || 0} productos inactivos de ${data?.totalProducts || 0} totales.

${data?.inactiveProducts > 0 ? `
**¿Por qué es importante?**
• Los productos inactivos ocupan espacio en el inventario
• Pueden generar confusión en la gestión
• Afectan la eficiencia operativa

**Recomendaciones:**
1. Revisa cada producto inactivo individualmente
2. Reactiva los que sean necesarios
3. Elimina los obsoletos definitivamente
4. Mantén un inventario limpio y actualizado` : 
'¡Perfecto! No tienes productos inactivos. Tu inventario está optimizado.'}`
    },

    // Preguntas sobre animales
    'animales|ganado|aves|pollos|gallinas': {
        response: (data) => `🐔 **Gestión de Animales:**

**Estado Actual:**
• Total de animales: ${data?.totalAnimals || 0}
• Distribuidos en: ${data?.totalLotes || 0} lotes
• Diversidad genética: ${data?.totalRaces || 0} razas diferentes

**Buenas Prácticas:**
1. **Monitoreo diario:** Revisa el estado de salud regularmente
2. **Alimentación:** Asegura suministro constante y de calidad
3. **Espacio:** Mantén densidad adecuada por lote
4. **Higiene:** Limpieza regular de instalaciones
5. **Registros:** Documenta cambios y observaciones

${data?.totalRaces >= 5 ? 
    '✅ **Excelente diversidad genética** - Reduces riesgos sanitarios.' : 
    '💡 **Considera** aumentar la diversidad de razas para mayor resistencia.'
}`
    },

    // Preguntas sobre producción
    'produccion|huevos|productividad': {
        response: (data) => `🥚 **Producción de Huevos:**

**Estimación Actual:**
• Producción estimada: ${data?.eggProduction || 0} huevos/día
• Basado en ${data?.totalAnimals || 0} animales

**Factores Clave para Optimizar:**
1. **Alimentación balanceada** (16-18% proteína)
2. **Agua fresca** disponible 24/7
3. **Iluminación** 14-16 horas/día
4. **Temperatura** ideal 18-24°C
5. **Estrés mínimo** - ambiente tranquilo
6. **Nidos limpios** y cómodos

**Indicadores de Buena Producción:**
• 70-80% de postura en gallinas adultas
• Huevos de tamaño uniforme
• Cáscaras firmes y limpias
• Comportamiento activo de las aves`
    },

    // Preguntas sobre temperatura y ambiente
    'temperatura|clima|ambiente|humedad': {
        response: (data) => `🌡️ **Condiciones Ambientales:**

**Estado Actual:**
• Temperatura: ${data?.avgTemperature || '--'}°C
• Humedad: ${data?.avgHumidity || '--'}%

**Rangos Óptimos:**
• **Temperatura:** 18-26°C (ideal 20-22°C)
• **Humedad:** 60-70%
• **Ventilación:** Constante pero sin corrientes

**Si la temperatura está:**
• **Muy alta (>28°C):** Aumenta ventilación, sombra, agua fresca
• **Muy baja (<15°C):** Calefacción, cortavientos, camas secas
• **Ideal (18-26°C):** Mantén las condiciones actuales

**Señales de Estrés Térmico:**
• Jadeo excesivo o aletargamiento
• Reducción en consumo de alimento
• Disminución en producción de huevos`
    },

    // Preguntas sobre alimentación
    'alimento|comida|alimentacion|consumo': {
        response: (data) => `🌾 **Alimentación:**

**Consumo Estimado Actual:**
• ${data?.feedConsumption || 0} kg/día para ${data?.totalAnimals || 0} animales

**Requerimientos por Ave/Día:**
• **Pollitos (0-8 sem):** 20-50g
• **Jóvenes (8-20 sem):** 50-100g  
• **Adultas (>20 sem):** 100-120g

**Componentes Esenciales:**
• **Proteína:** 16-20% (según etapa)
• **Energía:** 2800-3000 kcal/kg
• **Calcio:** 3-4% (ponedoras)
• **Agua:** 2-3 veces el consumo de alimento

**Consejos:**
1. Alimenta en horarios fijos
2. Almacena en lugar seco y fresco
3. Revisa fechas de vencimiento
4. Observa cambios en consumo`
    },

    // Preguntas sobre lotes
    'lotes|grupos|organizacion': {
        response: (data) => `📋 **Gestión de Lotes:**

**Estado Actual:**
• Total de lotes: ${data?.totalLotes || 0}
• Promedio por lote: ${data?.totalLotes > 0 ? Math.round((data?.totalAnimals || 0) / data.totalLotes) : 0} animales

**Buenas Prácticas:**
1. **Tamaño óptimo:** 50-200 aves por lote
2. **Edad similar:** Agrupa por etapa de desarrollo
3. **Raza homogénea:** Evita mezclar razas diferentes
4. **Registros claros:** Fecha, origen, tratamientos

**Beneficios de Lotes Bien Organizados:**
• Manejo sanitario más eficiente
• Alimentación específica por edad
• Control de producción más preciso
• Facilita tratamientos veterinarios`
    },

    // Preguntas sobre categorías y razas
    'categorias|razas|tipos|variedades': {
        response: (data) => `🏷️ **Categorías y Razas:**

**Diversidad Actual:**
• ${data?.totalCategories || 0} categorías registradas
• ${data?.totalRaces || 0} razas diferentes

**Ventajas de la Diversidad:**
• **Resistencia:** Menor riesgo de enfermedades
• **Adaptabilidad:** Mejor respuesta a cambios ambientales
• **Mercado:** Diferentes productos para distintos nichos
• **Genética:** Evita consanguinidad

**Razas Recomendadas por Propósito:**
• **Postura:** Rhode Island, Leghorn, Sussex
• **Carne:** Broiler, Cornish, Plymouth Rock
• **Doble propósito:** New Hampshire, Orpington

${data?.totalRaces >= 5 ? 
    '✅ Excelente diversidad genética en tu granja.' : 
    '💡 Considera incorporar más razas para mayor diversidad.'
}`
    },

    // Respuesta por defecto
    'default': {
        response: (data) => `🤖 **Asistente de Granja (Modo Offline)**

Lo siento, no tengo una respuesta específica para tu pregunta, pero puedo ayudarte con:

📊 **Temas Disponibles:**
• Estado general y rendimiento
• Gestión de productos inactivos
• Cuidado de animales y aves
• Optimización de producción de huevos
• Control de temperatura y ambiente
• Alimentación y nutrición
• Organización de lotes
• Diversidad de categorías y razas

**Tu granja actual:**
• ${data?.totalAnimals || 0} animales en ${data?.totalLotes || 0} lotes
• ${data?.activeProducts || 0}/${data?.totalProducts || 0} productos activos
• ${data?.totalRaces || 0} razas registradas

💡 **Tip:** Haz preguntas más específicas como "¿cómo mejorar la producción?" o "¿qué hacer con productos inactivos?"`
    }
};

export const getFallbackResponse = (question, dashboardData) => {
    const normalizedQuestion = question.toLowerCase();
    
    // Buscar coincidencias en las palabras clave
    for (const [keywords, responseObj] of Object.entries(fallbackChatResponses)) {
        if (keywords !== 'default') {
            const keywordList = keywords.split('|');
            if (keywordList.some(keyword => normalizedQuestion.includes(keyword))) {
                return responseObj.response(dashboardData);
            }
        }
    }
    
    // Si no encuentra coincidencias, usar respuesta por defecto
    return fallbackChatResponses.default.response(dashboardData);
};