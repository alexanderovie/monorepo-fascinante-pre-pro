# Hooks Personalizados

Este directorio contiene hooks personalizados reutilizables para el proyecto.

## useToast

Hook para mostrar notificaciones (toasts) internacionalizadas usando Sonner.

### Uso Básico

```tsx
import { useToast } from '@/app/[locale]/lib/hooks/use-toast';

function MyComponent() {
  const toast = useToast('audit.form'); // Namespace opcional

  const handleSubmit = async () => {
    try {
      // ... lógica
      toast.success('success'); // Busca 'audit.form.success'
    } catch (error) {
      toast.error('error'); // Busca 'audit.form.error'
    }
  };
}
```

### API

```tsx
const toast = useToast(namespace?: string);

// Métodos disponibles:
toast.success(messageKey, options?);
toast.error(messageKey, options?);
toast.info(messageKey, options?);
toast.warning(messageKey, options?);
toast.toast(messageKey, type, options?);
```

### Ejemplos

#### Toast simple
```tsx
toast.success('success');
```

#### Toast con descripción
```tsx
toast.error('error', {
  description: 'Detalles adicionales del error',
});
```

#### Toast con duración personalizada
```tsx
toast.info('info', {
  duration: 6000, // 6 segundos
});
```

### Traducciones

Las claves de traducción se buscan en el namespace especificado:

```json
// messages/es.json
{
  "audit": {
    "form": {
      "success": "¡Auditoría solicitada correctamente!",
      "error": "Error al enviar el formulario"
    }
  }
}
```

```tsx
const toast = useToast('audit.form');
toast.success('success'); // Muestra: "¡Auditoría solicitada correctamente!"
```

---

## Patrón de Uso Recomendado

1. **Usa el namespace del componente:**
   ```tsx
   // En AuditFormSection
   const toast = useToast('audit.form');
   ```

2. **Mantén las claves simples:**
   ```tsx
   toast.success('success'); // ✅
   toast.success('audit.form.success'); // ❌ Redundante
   ```

3. **Usa descripciones para detalles:**
   ```tsx
   toast.error('error', {
     description: errorMessage, // Mensaje dinámico
   });
   ```

