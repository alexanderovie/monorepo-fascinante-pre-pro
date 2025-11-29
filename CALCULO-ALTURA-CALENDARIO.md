# Cálculo de Altura del Calendario

## Elemento Analizado
El div del calendario: `div.w-80` (ancho de 320px)

## Estructura y Cálculo de Altura:

### 1. **Padding del contenedor principal**
- `p-3` = 12px arriba + 12px abajo = **24px total**

### 2. **Navegación del mes/año**
- Grid con botones `size-8` = 32px altura
- `pb-3` = 12px padding bottom
- **Total: ~44px**

### 3. **Días de la semana (headers)**
- `w-10` elementos con texto `text-sm`
- `pb-1.5` = 6px padding bottom
- Altura del texto: ~14px
- **Total: ~20px**

### 4. **Grid de días del calendario**
- **6 semanas siempre** (mes completo)
- Cada botón: `size-10` = **40px altura**
- Cada botón tiene `m-px` = 1px margin arriba + 1px abajo = **2px total**
- Por fila: 40px (botón) + 2px (margins) = **42px**
- **6 filas × 42px = 252px**

### 5. **Espaciado entre elementos**
- `space-y-0.5` = 2px entre elementos verticales
- Aproximadamente **2-4px** de espaciado adicional

## **ALTURA TOTAL APROXIMADA:**

```
24px (padding)
+ 44px (navegación)
+ 2px (espaciado)
+ 20px (días semana)
+ 2px (espaciado)
+ 252px (grid de días)
= 344px aproximadamente
```

## Resultado

**Altura aproximada del calendario: ~340-350px**

### Comparación con el contenedor:
- **Altura del calendario**: ~340-350px
- **Altura mínima del contenedor (desktop)**: 500px
- **Diferencia**: ~150-160px de espacio adicional

El calendario está centrado verticalmente dentro del contenedor de 500px, dejando aproximadamente **75-80px de espacio arriba y abajo**.
