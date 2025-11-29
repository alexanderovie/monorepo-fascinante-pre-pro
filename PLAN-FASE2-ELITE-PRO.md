# 🎯 PLAN FASE 2: Indicadores de Disponibilidad Elite Pro

## 📚 Basado en Consulta de Expertos (Context7)

Este plan está basado en:
- ✅ Documentación oficial de `react-day-picker` (modifiers y custom styling)
- ✅ Mejores prácticas de FullCalendar para carga de eventos
- ✅ Patrones escalables y robustos de la industria
- ✅ Arquitectura que NO rompe funcionalidad existente

---

## 🎨 ¿Qué vamos a hacer? (Explicación Simple)

**Imagínate esto:**
- Ahora cuando ves el calendario, TODAS las fechas se ven iguales
- No sabes si hay horarios disponibles o no hasta que haces click
- Es como ir a un restaurante sin saber si tiene mesa disponible

**Lo que vamos a hacer (Fase 2):**
1. **Ver cuántos horarios hay disponibles en cada día** - Antes de hacer click
2. **Colores que te dicen si hay muchos/pocos/ningún horario** - Verde = muchos, Amarillo = pocos, Gris = ninguno
3. **Contador visual** - "12 disponibles" o "Casi lleno" en cada día
4. **Conectar con la base de datos** - Para obtener horarios reales, no los hardcodeados

**¿Por qué es "Elite Pro"?**
- Los usuarios saben ANTES de hacer click si vale la pena
- Ahorra tiempo y clicks innecesarios
- Se ve profesional como Cal.com
- Es robusto (no se rompe si falla algo)
- Es escalable (funciona aunque tengas 1000 citas)

---

## 🏗️ Arquitectura: Cómo lo vamos a construir

### **Principio #1: No Romper Nada**
```
✅ Mantener el código actual funcionando
✅ Agregar nuevas funciones SIN tocar las viejas
✅ Si algo falla, el sistema sigue funcionando (fallback)
```

### **Principio #2: Separar Responsabilidades**
```
📦 3 Capas Separadas:
1. UI Layer (BookingForm) - Solo muestra cosas bonitas
2. Service Layer (availabilityService) - Lógica de negocio
3. Data Layer (Supabase) - Solo datos
```

### **Principio #3: Manejo Robusto de Errores**
```
✅ Si falla la conexión a BD → Mostrar mensaje amigable
✅ Si no hay datos → Mostrar "Cargando..." y luego "No disponible"
✅ Si hay error → Log en consola pero UI sigue funcionando
```

---

## 📋 Implementación Paso a Paso

### **PASO 1: Crear Servicio de Disponibilidad (Backend)**

**Ubicación:** `apps/web-publica/lib/appointments/availability-service.ts`

**¿Qué hace?**
- Conecta con Supabase
- Calcula qué días tienen horarios disponibles
- Retorna datos limpios que el componente puede usar

**Estructura:**
```typescript
// Función que calcula disponibilidad por día
async function getAvailabilityByDateRange(startDate, endDate) {
  // 1. Obtener todas las citas confirmadas en ese rango
  // 2. Obtener configuraciones de disponibilidad
  // 3. Calcular qué horarios están libres
  // 4. Retornar: { fecha: "2025-01-15", slotsDisponibles: 8, slotsTotales: 12 }
}
```

**Por qué es robusto:**
- ✅ Usa try/catch para manejar errores
- ✅ Retorna siempre el mismo formato (aunque falle)
- ✅ Cachea resultados para no hacer muchas consultas

---

### **PASO 2: Hook Personalizado (React)**

**Ubicación:** `apps/web-publica/components/booking/hooks/useAvailability.ts`

**¿Qué hace?**
- Es un "helper" que React puede usar
- Se encarga de cargar los datos cuando cambia el mes
- Maneja estados de "cargando", "error", "éxito"

**Estructura:**
```typescript
function useAvailability(month: Date) {
  const [availability, setAvailability] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Cargar disponibilidad cuando cambia el mes
  }, [month])

  return { availability, isLoading, error }
}
```

**Por qué es escalable:**
- ✅ Se puede usar en cualquier componente
- ✅ Maneja su propio estado (no contamina otros componentes)
- ✅ Se puede testear fácilmente

---

### **PASO 3: Modifiers en react-day-picker**

**Basado en documentación oficial de react-day-picker**

**¿Qué son los modifiers?**
Son "etiquetas" que puedes poner en cada día del calendario. Por ejemplo:
- `available` = tiene muchos horarios
- `few-slots` = tiene pocos horarios
- `unavailable` = no tiene horarios

**Cómo se usan:**
```typescript
<DayPicker
  modifiers={{
    available: datesWithManySlots,  // Días con 6+ horarios
    fewSlots: datesWithFewSlots,    // Días con 1-5 horarios
    unavailable: datesWithoutSlots   // Días sin horarios
  }}
  modifiersClassNames={{
    available: "bg-green-50 border-green-300",
    fewSlots: "bg-yellow-50 border-yellow-300",
    unavailable: "opacity-40"
  }}
/>
```

**Por qué es elite:**
- ✅ Usa las APIs oficiales de la librería (no hacks)
- ✅ Es accesible (screen readers pueden entenderlo)
- ✅ Es performante (React optimiza automáticamente)

---

### **PASO 4: Contador Visual en Cada Día**

**¿Qué es?**
Un pequeño badge o número que muestra cuántos horarios hay disponibles.

**Ejemplo visual:**
```
┌─────────────────┐
│  15 (Día)       │
│  [8] disponibles│  ← Este número
└─────────────────┘
```

**Implementación:**
Usando el `footer` prop de DayPicker para mostrar info adicional:
```typescript
<DayPicker
  footer={
    selectedDate && availability[selectedDate] && (
      <div className="text-xs text-center mt-2">
        {availability[selectedDate].slotsDisponibles} disponibles
      </div>
    )
  }
/>
```

---

### **PASO 5: Loading States Elegantes**

**¿Por qué es importante?**
- Mientras carga, el usuario ve que algo está pasando
- No parece que el sitio se congeló
- Profesional y pulido

**Estados:**
1. **Loading inicial:** "Cargando disponibilidad..."
2. **Skeleton states:** Calendario con días "grises" mientras carga
3. **Loaded:** Calendario con colores según disponibilidad

---

### **PASO 6: Cache y Performance**

**¿Por qué cachear?**
- Si el usuario cambia de mes y vuelve, no recargar
- Menos consultas a la BD = más rápido
- Menor costo de servidor

**Cómo lo hacemos:**
```typescript
// Cache en memoria (simple pero efectivo)
const cache = new Map()

function getAvailability(date) {
  const key = date.toISOString().split('T')[0] // "2025-01-15"

  if (cache.has(key)) {
    return cache.get(key) // Ya lo tenemos, devolver rápido
  }

  // Si no, cargar de BD y guardar en cache
  const data = await fetchFromDB(date)
  cache.set(key, data)
  return data
}
```

**Invalidación de cache:**
- Cuando se reserva una cita → limpiar cache de ese día
- Después de X minutos → limpiar cache viejo

---

## 🛡️ Manejo de Errores (Robusto)

### **Escenario 1: Error de Conexión**
```typescript
try {
  const data = await fetchAvailability()
} catch (error) {
  // Fallback: Mostrar todos los días como "disponibles"
  // Mejor mostrar algo que nada
  console.error("Error loading availability:", error)
  return defaultAvailability()
}
```

### **Escenario 2: Sin Datos**
```typescript
if (!data || data.length === 0) {
  // Mostrar mensaje amigable
  return {
    message: "No hay disponibilidad en este momento",
    showRetryButton: true
  }
}
```

### **Escenario 3: Datos Incompletos**
```typescript
// Validar que los datos tienen la estructura correcta
if (!isValidAvailabilityData(data)) {
  // Usar datos por defecto en lugar de romper
  return getDefaultAvailability()
}
```

---

## 🎯 Testing (Sin Romper Nada)

### **Test 1: Código Actual Sigue Funcionando**
- ✅ Seleccionar fecha → Debe funcionar igual
- ✅ Seleccionar horario → Debe funcionar igual
- ✅ Navegación por teclado → Debe funcionar igual

### **Test 2: Nuevas Funcionalidades**
- ✅ Calendario muestra colores correctos
- ✅ Contador de disponibilidad es correcto
- ✅ Loading states funcionan

### **Test 3: Casos Edge**
- ✅ Sin conexión a internet → Muestra mensaje
- ✅ BD vacía → Muestra "No disponible"
- ✅ Mes sin citas → Muestra todos disponibles

---

## 📦 Estructura de Archivos (Organizado)

```
apps/web-publica/
├── lib/
│   └── appointments/
│       ├── availability-service.ts     ← Nueva: Lógica de negocio
│       └── types.ts                    ← Nueva: Tipos TypeScript
│
├── components/
│   └── booking/
│       ├── BookingForm.tsx             ← Modificar: Agregar modifiers
│       ├── hooks/
│       │   └── useAvailability.ts      ← Nueva: Hook React
│       └── ui/
│           └── AvailabilityBadge.tsx   ← Nueva: Componente visual
│
└── app/
    └── api/
        └── appointments/
            └── availability/
                └── route.ts            ← Nueva: API endpoint (opcional)
```

---

## 🔄 Flujo de Datos (Cómo Funciona)

```
1. Usuario abre calendario
   ↓
2. useAvailability hook se ejecuta
   ↓
3. Llama a availability-service.ts
   ↓
4. availability-service consulta Supabase
   ↓
5. Calcula disponibilidad por día
   ↓
6. Retorna datos estructurados
   ↓
7. BookingForm recibe datos
   ↓
8. Aplica modifiers a react-day-picker
   ↓
9. Usuario ve colores y contadores
```

**Si algo falla en cualquier paso:**
- Muestra estado de error
- Permite seguir usando el calendario (sin colores)
- No rompe la funcionalidad existente

---

## ✅ Checklist de Implementación

### **Día 1: Backend/Service Layer**
- [ ] Crear `availability-service.ts`
- [ ] Función para calcular disponibilidad
- [ ] Manejo de errores robusto
- [ ] Tests básicos

### **Día 2: React Hook**
- [ ] Crear `useAvailability.ts`
- [ ] Estados de loading/error/success
- [ ] Cache básico
- [ ] Integración con service

### **Día 3: UI/Modifiers**
- [ ] Modificar BookingForm
- [ ] Agregar modifiers al DayPicker
- [ ] Estilos para cada estado (verde/amarillo/gris)
- [ ] Contador visual

### **Día 4: Polish & Testing**
- [ ] Loading states elegantes
- [ ] Manejo de errores en UI
- [ ] Tests de integración
- [ ] Verificar que no se rompió nada

### **Día 5: Optimización**
- [ ] Mejorar cache
- [ ] Optimizar queries a BD
- [ ] Performance testing
- [ ] Documentación

---

## 🎨 Colores y Estados Visuales

### **Verde (Muchos horarios - 6+)**
```css
.bg-green-50          /* Fondo suave */
.border-green-300     /* Borde verde */
.text-green-700       /* Texto verde oscuro */
```

### **Amarillo (Pocos horarios - 1 a 5)**
```css
.bg-yellow-50         /* Fondo suave */
.border-yellow-300    /* Borde amarillo */
.text-yellow-700      /* Texto amarillo oscuro */
```

### **Gris (Sin horarios - 0)**
```css
.opacity-40           /* Día semi-transparente */
.cursor-not-allowed   /* Cursor de no permitido */
.line-through         /* Tachado opcional */
```

---

## 📊 Ejemplo de Datos (Formato)

```typescript
// Lo que retorna availability-service
{
  "2025-01-15": {
    slotsDisponibles: 8,
    slotsTotales: 12,
    slotsOcupados: 4,
    porcentaje: 66.67
  },
  "2025-01-16": {
    slotsDisponibles: 2,
    slotsTotales: 12,
    slotsOcupados: 10,
    porcentaje: 16.67
  },
  "2025-01-17": {
    slotsDisponibles: 0,
    slotsTotales: 12,
    slotsOcupados: 12,
    porcentaje: 0
  }
}
```

---

## 🚀 Ventajas de Esta Arquitectura

### **Robusto:**
- ✅ Manejo de errores en cada capa
- ✅ Fallbacks cuando algo falla
- ✅ Validación de datos

### **Escalable:**
- ✅ Separación de responsabilidades
- ✅ Fácil de extender (agregar más estados)
- ✅ Cache para performance

### **Mantenible:**
- ✅ Código organizado por capas
- ✅ Fácil de testear
- ✅ Fácil de debuggear

### **Sin Romper Nada:**
- ✅ Código nuevo no toca código viejo
- ✅ Si falla, el sistema sigue funcionando
- ✅ Backward compatible 100%

---

**¿Listo para implementar?** 🚀
