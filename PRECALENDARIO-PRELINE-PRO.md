# 📅 Componente de Calendario Preline Pro

## ✅ Lo que Preline Pro ofrece:

Preline Pro tiene un **Datepicker Avanzado** basado en **Vanilla Calendar Pro** que es perfecto para booking de citas.

---

## 🎯 Componente: `hs-datepicker`

### Características:
- ✅ **Modo inline** - Se muestra directamente en la página (no como dropdown)
- ✅ **Vista mensual** - Calendario mensual completo
- ✅ **Selección de fecha única** o múltiple
- ✅ **Personalizable** - Templates y layouts custom
- ✅ **Dark mode** - Soporte completo
- ✅ **Navegación entre meses** - Flechas prev/next
- ✅ **Selección de hora** - Opcional con time picker

---

## 📋 Lo que debes buscar en tu cuenta Preline Pro:

### 1. **Documentación del Datepicker Avanzado**
- Busca: **"Advanced Datepicker"** o **"Datepicker"**
- URL probable: `https://preline.co/docs/advanced-datepicker`
- O busca en: **Components → Forms → Datepicker**

### 2. **Ejemplo específico que necesitas:**
Busca este ejemplo en particular:
- **"Inline Datepicker"** o **"Inline Calendar"**
- Un datepicker que se muestre directamente (no como input)

### 3. **Ejemplo de código que buscar:**

```html
<!-- Inline Datepicker -->
<div class="hs-datepicker" data-hs-datepicker='{
  "inputMode": false,
  "type": "default",
  "displayDatesOutside": false,
  "dateMax": "2050-12-31"
}'></div>
```

**Características clave del ejemplo que necesitas:**
- `"inputMode": false` - Para que sea inline (no input)
- `"type": "default"` - Selección de fecha única
- Navegación con flechas personalizadas
- Vista mensual completa

---

## 🔑 Términos clave para buscar:

1. **"hs-datepicker inline"**
2. **"Vanilla Calendar Pro"**
3. **"Datepicker calendar view"**
4. **"Inline calendar"**
5. **"Advanced Datepicker"**

---

## 📦 Dependencias necesarias:

Si usas Preline Pro, necesitarás:

```bash
npm i vanilla-calendar-pro
npm i lodash  # Requerido por Vanilla Calendar
```

---

## 🎨 Estilo que necesitamos:

El datepicker de Preline Pro puede personalizarse con:
- **Templates custom** para las flechas de navegación
- **Layouts personalizados** para el calendario mensual
- **Estilos** usando las clases de Tailwind que ya tienes

---

## 💡 Qué compartir conmigo:

Cuando encuentres el componente en Preline Pro, comparte:

1. **El HTML completo** del ejemplo inline datepicker
2. **El JavaScript de inicialización** (si lo hay)
3. **El CSS/clases** que usa
4. **Las opciones de configuración** (`data-hs-datepicker`)

Con eso podré adaptarlo perfectamente a nuestra página `/book` manteniendo el estilo consistente.

---

## 🔍 Alternativa si no encuentras el inline:

Si Preline Pro no tiene un datepicker inline que te guste, podemos:
1. Mantener `react-day-picker` (que ya funciona perfecto)
2. Aplicar estilos de Preline UI sobre `react-day-picker`
3. Mezclar lo mejor de ambos

---

**¿Encontraste el componente? Compárteme el código HTML del ejemplo inline datepicker que más te guste y lo adaptamos!**
