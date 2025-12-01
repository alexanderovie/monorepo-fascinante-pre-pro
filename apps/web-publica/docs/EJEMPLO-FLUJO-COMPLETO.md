# Ejemplo Completo: Flujo LLM con Tools

## Escenario Real

**Usuario 1:** "Analiza mi negocio y muéstrame la demanda del mercado"

**Usuario 2:** "Empanadazo en West Palm Beach"

---

## Flujo Completo Paso a Paso

### Mensaje 1: Usuario Inicial

```json
{
  "role": "user",
  "parts": [
    {
      "type": "text",
      "text": "Analiza mi negocio y muéstrame la demanda del mercado"
    }
  ]
}
```

**LLM razona:**
- Necesita nombre de negocio
- Necesita ciudad
- Sin esta info, no puede usar tools

**Respuesta del LLM:**
```
"Para analizar tu negocio y mostrarte la demanda del mercado, necesito:
- ¿Nombre del negocio?
- ¿En qué ciudad está ubicado?"
```

---

### Mensaje 2: Usuario Proporciona Info

```json
{
  "role": "user",
  "parts": [
    {
      "type": "text",
      "text": "Empanadazo en West Palm Beach"
    }
  ]
}
```

**LLM razona:**
1. ✅ Tengo nombre: "Empanadazo"
2. ✅ Tengo ciudad: "West Palm Beach"
3. 📋 Estrategia:
   - **Paso 1**: Buscar el negocio primero para obtener categoría y contexto
   - **Paso 2**: Con esa info, construir keywords precisas
   - **Paso 3**: Buscar demanda de mercado con esas keywords

---

### PASO 1: LLM Crea Primer Tool Call

**Decisión del LLM:**
"Voy a buscar primero el negocio para entender su categoría y contexto"

**JSON Interno que el LLM genera:**

```json
{
  "toolCalls": [
    {
      "toolCallId": "call_abc123xyz",
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

**Request HTTP que AI SDK envía:**

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
          "category": ["restaurant", "food", "latin_american_restaurant"],
          "address": {
            "address": "123 Main St",
            "city": "West Palm Beach",
            "state": "FL",
            "zip": "33401"
          },
          "phone": "+15612345678",
          "website": "https://empanadazo.com"
        }]
      }]
    }]
  },
  "cost": 0.0054
}
```

---

### PASO 2: LLM Procesa Resultado y Razona

**Información obtenida:**
- ✅ Negocio existe
- ✅ Categoría: "restaurant", "food", "latin_american_restaurant"
- ✅ Es un restaurante de comida latina/empanadas
- ✅ Rating: 4.5/5 (120 reviews)

**Nueva decisión del LLM (COMPORTAMIENTO PROACTIVO):**
"Encontré el negocio. Según las instrucciones, debo buscar competidores AUTOMÁTICAMENTE usando las categorías obtenidas. Luego, si el usuario preguntó por demanda, buscaré eso también."

**Keywords que el LLM construye inteligentemente:**
- "empanadas West Palm Beach"
- "empanadas restaurant West Palm Beach"
- "best empanadas West Palm Beach"
- "latin american restaurant West Palm Beach"
- "empanadas near me"

---

### PASO 3: LLM Crea Segundo Tool Call (COMPETIDORES - Automático)

**Decisión del LLM:**
"Voy a buscar competidores automáticamente usando las categorías que obtuve: restaurant, food, latin_american_restaurant"

**JSON Interno:**

```json
{
  "toolCalls": [
    {
      "toolCallId": "call_def456uvw",
      "toolName": "searchAllCompetitors",
      "args": {
        "location_name": "West Palm Beach,Florida,United States",
        "categories": ["restaurant", "food", "latin_american_restaurant"],
        "limit": 20
      }
    }
  ]
}
```

**Request HTTP:**

```http
POST https://data.fascinantedigital.com/v3/business_data/business_listings/search/live.ai
Content-Type: application/json
X-User-Plan: free
X-Force-Refresh: false

{
  "location_name": "West Palm Beach,Florida,United States",
  "categories": ["restaurant", "food", "latin_american_restaurant"],
  "limit": 20
}
```

**Response del Gateway:**

```json
{
  "success": true,
  "data": {
    "tasks": [{
      "result": [{
        "items": [
          {
            "title": "Waros Grill Venezuelan Food Truck",
            "rating": {"value": 4.5, "votes_count": 211},
            "address": "123 Food Truck St, West Palm Beach, FL"
          },
          {
            "title": "El Tizon Latino Grill",
            "rating": {"value": 4.9, "votes_count": 205},
            "address": "456 Main Ave, West Palm Beach, FL"
          },
          {
            "title": "Paluva - El palacio de la Lechona",
            "rating": {"value": 4.7, "votes_count": 205},
            "address": "789 Oak Blvd, West Palm Beach, FL"
          }
        ]
      }]
    }]
  },
  "cost": 0.012
}
```

---

### PASO 4: LLM Crea Tercer Tool Call (Si pregunta por demanda)

**Si el usuario preguntó por demanda de mercado, el LLM ahora busca:**

**JSON Interno:**

```json
{
  "toolCalls": [
    {
      "toolCallId": "call_ghi789rst",
      "toolName": "analyzeSearchDemand",
      "args": {
        "keywords": [
          "empanadas West Palm Beach",
          "empanadas restaurant West Palm Beach",
          "best empanadas West Palm Beach",
          "latin american restaurant West Palm Beach"
        ],
        "location_name": "United States",
        "language_code": "en"
      }
    }
  ]
}
```

**Request HTTP:**

```http
POST https://data.fascinantedigital.com/v3/dataforseo_labs/google/keyword_overview/live.ai
Content-Type: application/json
X-User-Plan: free
X-Force-Refresh: false

{
  "keywords": [
    "empanadas West Palm Beach",
    "empanadas restaurant West Palm Beach",
    "best empanadas West Palm Beach",
    "latin american restaurant West Palm Beach"
  ],
  "location_name": "United States",
  "language_code": "en"
}
```

**Response del Gateway:**

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
            "cpc": 1.2,
            "competition": "medium"
          },
          {
            "keyword": "empanadas restaurant West Palm Beach",
            "search_volume": 320,
            "cpc": 0.9,
            "competition": "low"
          },
          {
            "keyword": "best empanadas West Palm Beach",
            "search_volume": 210,
            "cpc": 1.5,
            "competition": "medium"
          },
          {
            "keyword": "latin american restaurant West Palm Beach",
            "search_volume": 590,
            "cpc": 1.1,
            "competition": "medium"
          }
        ]
      }]
    }]
  },
  "cost": 0.012
}
```

---

### PASO 5: LLM Genera Respuesta Final

El LLM ahora tiene toda la información necesaria:
- ✅ Datos del negocio (rating, reviews, categoría, dirección, teléfono, horarios)
- ✅ Competidores (automáticamente obtenidos)
- ✅ Demanda de mercado (si el usuario la pidió)

**Respuesta generada por el LLM (formato estructurado):**

```
Aquí tienes la información sobre **El Empanadazo** en West Palm Beach:

### El Empanadazo

- **Descripción**: Restaurante familiar que ofrece comida venezolana, evocando recuerdos de comidas caseras hechas con amor.

- **Categoría**: Restaurante

- **Dirección**: 3613 S Military Trl Suite A,B, Lake Worth Beach, FL 33463

- **Teléfono**: +1 (561) 444-2653

- **Horarios**:
  - **Domingo**: 8:00 AM - 10:00 PM
  - **Lunes a Viernes**: 7:00 AM - 10:00 PM
  - **Sábado**: 8:00 AM - 10:00 PM

- **Rating**: 4.5/5 (256 votos)

- **Precio**: Económico

- **Atributos**:
  - Opción de entrega y para llevar
  - Acceso para silla de ruedas
  - Ambientes acogedor y familiar
  - Aceptan tarjetas de crédito y débito

### Competidores Populares

1. **Waros Grill Venezuelan Food Truck** - Rating: 4.5 (211 votos)

2. **El Tizon Latino Grill** - Rating: 4.9 (205 votos)

3. **Paluva - El palacio de la Lechona** - Rating: 4.7 (205 votos)

4. **El Flako del Sabor Food Truck** - Rating: 5.0 (21 votos)

[Si el usuario preguntó por demanda, incluir sección:]

### Demanda de Mercado

Análisis de búsquedas mensuales en Google:

- **"empanadas West Palm Beach"**: 880 búsquedas/mes
- **"empanadas restaurant West Palm Beach"**: 320 búsquedas/mes
- **"best empanadas West Palm Beach"**: 210 búsquedas/mes
- **"latin american restaurant West Palm Beach"**: 590 búsquedas/mes

**Total**: ~2,000 búsquedas/mes relacionadas

Si necesitas más información o asistencia, ¡no dudes en preguntar!
```

---

## Flujo Alternativo: Si el Negocio No Se Encuentra

### Escenario: Tool analyzeMyBusiness retorna 404

**Response del Gateway:**

```json
{
  "success": false,
  "error": "Business not found"
}
```

**LLM razona:**
"El negocio no se encontró. Puedo intentar variar el keyword o preguntar más detalles"

**Estrategia del LLM:**
1. Intentar con keyword más simple: "Empanadazo"
2. Si falla, preguntar por más detalles (dirección, categoría)

**JSON del segundo intento:**

```json
{
  "toolCallId": "call_retry789",
  "toolName": "analyzeMyBusiness",
  "args": {
    "keyword": "Empanadazo",
    "location_name": "West Palm Beach,Florida,United States",
    "language_code": "en"
  }
}
```

Si también falla:

**Respuesta del LLM:**
```
No pude encontrar "Empanadazo" en West Palm Beach. Para ayudarte mejor, ¿podrías proporcionar:
- La dirección exacta del negocio
- O el nombre completo si es diferente
- O la categoría del negocio (restaurante, tienda, etc.)
```

---

## Resumen del Flujo Completo (Comportamiento Proactivo)

```
Usuario: "Analiza mi negocio y muéstrame la demanda del mercado"
   ↓
LLM: "Necesito nombre y ciudad"
   ↓
Usuario: "Empanadazo en West Palm Beach"
   ↓
LLM razona → Paso 1: Buscar negocio
   ↓
Tool Call 1: analyzeMyBusiness
   ↓
Resultado: Negocio encontrado (categoría: restaurant, food, latin_american_restaurant)
   ↓
LLM razona → Paso 2: AUTOMÁTICAMENTE buscar competidores (proactivo)
   ↓
Tool Call 2: searchAllCompetitors (con categorías obtenidas)
   ↓
Resultado: Lista de competidores obtenida
   ↓
LLM razona → Paso 3: Buscar demanda (porque el usuario la pidió)
   ↓
Tool Call 3: analyzeSearchDemand (con keywords construidas)
   ↓
Resultado: Volúmenes de búsqueda obtenidos
   ↓
LLM genera respuesta final con:
  - Datos del negocio (formato estructurado)
  - Competidores populares (automáticamente incluidos)
  - Demanda de mercado (si fue solicitada)
```

---

## Ventajas de Este Enfoque

✅ **Inteligente**: Busca primero para entender contexto
✅ **Preciso**: Construye keywords basadas en datos reales
✅ **Eficiente**: Solo hace las llamadas necesarias
✅ **Robusto**: Maneja errores y variaciones

---

## Control de Costos

- **Paso 1**: analyzeMyBusiness = ~$0.0054
- **Paso 2**: analyzeSearchDemand = ~$0.012
- **Total**: ~$0.0174 por consulta completa

Con `stopWhen: stepCountIs(5)`, máximo 5 pasos = ~$0.05 por consulta en el peor caso.

