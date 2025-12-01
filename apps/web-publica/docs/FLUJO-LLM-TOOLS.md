# Flujo LLM con Tools - Ejemplo Real

## Escenario: "Analiza mi negocio y muéstrame la demanda del mercado"

### Conversación

**Usuario 1:** "Analiza mi negocio y muéstrame la demanda del mercado"

**Usuario 2:** "Empanadazo en West Palm Beach"

---

## Flujo Paso a Paso

### PASO 1: LLM Recibe el Contexto

El LLM tiene acceso a:
- **System Prompt**: Instrucciones sobre cuándo usar tools
- **Tools disponibles**: `analyzeMyBusiness`, `searchAllCompetitors`, `analyzeSearchDemand`, `findRelatedSearches`
- **Historial de mensajes**: 
  ```json
  [
    {
      "role": "user",
      "parts": [{"type": "text", "text": "Analiza mi negocio y muéstrame la demanda del mercado"}]
    },
    {
      "role": "user", 
      "parts": [{"type": "text", "text": "Empanadazo en West Palm Beach"}]
    }
  ]
  ```

### PASO 2: LLM Razona (Multi-Step Reasoning)

El LLM analiza:
1. **Necesita**: Nombre del negocio ✅ ("Empanadazo")
2. **Necesita**: Ciudad ✅ ("West Palm Beach")
3. **Necesita**: Demanda de mercado → Requiere keywords relacionadas
4. **Estrategia**: 
   - Primero buscar el negocio para entender categoría/contexto
   - Luego usar esa info para buscar demanda

### PASO 3: LLM Decide Usar Tools (Paso 1)

**Decisión**: Usar `analyzeMyBusiness` primero para:
- Confirmar que el negocio existe
- Obtener categoría (ej: "restaurant", "food")
- Entender el contexto del negocio

**JSON que el LLM crea internamente:**

```json
{
  "toolCalls": [
    {
      "toolCallId": "call_abc123",
      "toolName": "analyzeMyBusiness",
      "args": {
        "keyword": "Empanadazo West Palm Beach",
        "location_name": "West Palm Beach,Florida,United States",
        "language_code": "en"
      }
    }
  ]
}
```

**Request al Gateway:**

```http
POST https://data.fascinantedigital.com/v3/business_data/google/my_business_info/live.ai
Content-Type: application/json
X-User-Plan: free
X-Force-Refresh: false

{
  "keyword": "Empanadazo West Palm Beach",
  "location_name": "West Palm Beach,Florida,United States",
  "language_code": "en"
}
```

### PASO 4: LLM Recibe Resultado del Tool

**Response del Gateway:**

```json
{
  "success": true,
  "data": {
    "tasks": [{
      "result": [{
        "items": [{
          "title": "Empanadazo",
          "rating": {
            "value": 4.5,
            "votes_count": 120
          },
          "category": ["restaurant", "food"],
          "address": "123 Main St, West Palm Beach, FL",
          "phone": "+15612345678"
        }]
      }]
    }]
  },
  "cost": 0.0054
}
```

### PASO 5: LLM Razona con el Resultado

El LLM ahora sabe:
- ✅ Negocio existe
- ✅ Categoría: "restaurant" / "food"
- ✅ Es un restaurante de empanadas

**Nueva decisión**: Necesita buscar demanda de mercado para:
- "empanadas West Palm Beach"
- "empanadas restaurant"
- "empanadas near me"

### PASO 6: LLM Usa Segundo Tool (Paso 2)

**Decisión**: Usar `analyzeSearchDemand` con keywords relacionadas

**JSON que el LLM crea:**

```json
{
  "toolCalls": [
    {
      "toolCallId": "call_def456",
      "toolName": "analyzeSearchDemand",
      "args": {
        "keywords": [
          "empanadas West Palm Beach",
          "empanadas restaurant",
          "empanadas near me",
          "best empanadas West Palm Beach"
        ],
        "location_name": "United States",
        "language_code": "en"
      }
    }
  ]
}
```

**Request al Gateway:**

```http
POST https://data.fascinantedigital.com/v3/dataforseo_labs/google/keyword_overview/live.ai
Content-Type: application/json
X-User-Plan: free
X-Force-Refresh: false

{
  "keywords": [
    "empanadas West Palm Beach",
    "empanadas restaurant",
    "empanadas near me",
    "best empanadas West Palm Beach"
  ],
  "location_name": "United States",
  "language_code": "en"
}
```

### PASO 7: LLM Recibe Segundo Resultado

**Response:**

```json
{
  "success": true,
  "data": {
    "tasks": [{
      "result": [{
        "items": [
          {
            "keyword": "empanadas West Palm Beach",
            "search_volume": 880,
            "cpc": 1.2
          },
          {
            "keyword": "empanadas restaurant",
            "search_volume": 2400,
            "cpc": 0.8
          }
        ]
      }]
    }]
  },
  "cost": 0.012
}
```

### PASO 8: LLM Genera Respuesta Final

El LLM ahora tiene toda la información:
- ✅ Datos del negocio (rating, reviews, dirección)
- ✅ Demanda de mercado (volúmenes de búsqueda)

**Respuesta generada:**

```
He analizado Empanadazo en West Palm Beach. Aquí está la información:

📊 TU NEGOCIO:
- ⭐ Rating: 4.5/5 (120 reseñas)
- 📍 Dirección: 123 Main St, West Palm Beach, FL
- 📞 Teléfono: +1 561-234-5678

📈 DEMANDA DE MERCADO:
- "empanadas West Palm Beach": 880 búsquedas/mes
- "empanadas restaurant": 2,400 búsquedas/mes
- "empanadas near me": 1,200 búsquedas/mes

💡 OPORTUNIDADES:
Tu negocio tiene buena calificación (4.5/5), pero hay demanda significativa 
en tu área. Considera optimizar tu perfil de Google Business para aparecer 
en estas búsquedas.
```

---

## Flujo Alternativo: Si el LLM es Más Inteligente

### Estrategia Optimizada (2 pasos en paralelo)

El LLM podría razonar: "Necesito el negocio Y la demanda, puedo hacerlo en paralelo"

**Paso 1 (Paralelo):**

```json
{
  "toolCalls": [
    {
      "toolCallId": "call_abc123",
      "toolName": "analyzeMyBusiness",
      "args": {
        "keyword": "Empanadazo West Palm Beach",
        "location_name": "West Palm Beach,Florida,United States",
        "language_code": "en"
      }
    },
    {
      "toolCallId": "call_def456",
      "toolName": "analyzeSearchDemand",
      "args": {
        "keywords": ["empanadas West Palm Beach", "empanadas restaurant"],
        "location_name": "United States",
        "language_code": "en"
      }
    }
  ]
}
```

**Nota**: AI SDK ejecuta tools en paralelo cuando es posible, pero el LLM decide el orden basado en dependencias.

---

## Flujo con Búsqueda Inteligente de Categoría

### Si el LLM Quiere Ser Más Preciso

**Paso 1**: Buscar negocio primero
```json
{
  "toolName": "analyzeMyBusiness",
  "args": {
    "keyword": "Empanadazo West Palm Beach",
    "location_name": "West Palm Beach,Florida,United States",
    "language_code": "en"
  }
}
```

**Paso 2**: Con la categoría obtenida ("restaurant"), buscar competidores
```json
{
  "toolName": "searchAllCompetitors",
  "args": {
    "location_name": "West Palm Beach,Florida,United States",
    "categories": ["restaurant"],  // ← Obtenido del paso 1
    "limit": 20
  }
}
```

**Paso 3**: Buscar demanda con keywords más específicas
```json
{
  "toolName": "analyzeSearchDemand",
  "args": {
    "keywords": [
      "empanadas West Palm Beach",
      "restaurant West Palm Beach",
      "best empanadas Florida"
    ],
    "location_name": "United States",
    "language_code": "en"
  }
}
```

---

## Resumen del Flujo

1. **LLM recibe mensajes** → Analiza contexto
2. **LLM razona** → Decide qué tools necesita
3. **LLM crea JSON** → Tool calls con parámetros
4. **AI SDK ejecuta** → Llama al gateway
5. **LLM recibe resultados** → Procesa datos
6. **LLM decide siguiente paso** → Más tools o respuesta final
7. **LLM genera respuesta** → Texto con datos reales

---

## Ventajas del Multi-Step Reasoning

✅ **Inteligente**: El LLM puede buscar primero para entender contexto
✅ **Adaptativo**: Ajusta keywords basado en resultados
✅ **Eficiente**: Puede hacer llamadas en paralelo cuando es posible
✅ **Robusto**: Si un tool falla, puede intentar alternativas

---

## Control de Costos

Con `stopWhen: stepCountIs(5)`:
- Máximo 5 pasos (tool calls + respuestas)
- Si necesita más, se detiene y responde con lo que tiene
- Evita loops infinitos y costos excesivos

