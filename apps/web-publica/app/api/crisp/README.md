# API Routes de Crisp - Guía de Uso

Rutas API listas para probar y gestionar la configuración de Crisp.

## 🧪 Endpoint de Prueba

### `GET /api/crisp/test`

Verifica la conexión con Crisp y obtiene información del website.

**Ejemplo de uso:**
```bash
curl http://localhost:3002/api/crisp/test
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "✅ Conexión con Crisp API exitosa",
  "data": {
    "website": {
      "id": "143bd97c-6b63-4c7b-a77a-feaec2ed8e58",
      "name": "Fascinante Digital",
      "domain": "fascinantedigital.com"
    },
    "chatbox": {
      "color": "blue",
      "position": "right"
    }
  }
}
```

### `POST /api/crisp/test`

Actualiza la configuración del chatbox (ejemplo simple).

**Ejemplo de uso:**
```bash
curl -X POST http://localhost:3002/api/crisp/test \
  -H "Content-Type: application/json" \
  -d '{
    "color": "blue",
    "position": "right",
    "welcomeMessage": "¡Hola! ¿En qué puedo ayudarte?"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "✅ Configuración actualizada exitosamente",
  "data": {
    "updated": {
      "color": "blue",
      "position": "right",
      "text": {
        "welcome": "¡Hola! ¿En qué puedo ayudarte?"
      }
    },
    "current": {
      "color": "blue",
      "position": "right",
      "text": {
        "welcome": "¡Hola! ¿En qué puedo ayudarte?"
      }
    }
  }
}
```

## 🎨 Endpoint de Gestión del Chatbox

### `GET /api/crisp/chatbox`

Obtiene la configuración actual del chatbox.

**Ejemplo de uso:**
```bash
curl http://localhost:3002/api/crisp/chatbox
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "color": "blue",
    "position": "right",
    "text": {
      "welcome": "¡Hola!",
      "offline": "Estamos fuera de línea"
    },
    "notifications": {
      "enabled": true,
      "sound": true
    }
  }
}
```

### `PATCH /api/crisp/chatbox`

Actualiza la configuración del chatbox.

**Ejemplo de uso:**
```bash
curl -X PATCH http://localhost:3002/api/crisp/chatbox \
  -H "Content-Type: application/json" \
  -d '{
    "color": "blue",
    "position": "right",
    "text": {
      "welcome": "¡Bienvenido! ¿En qué puedo ayudarte?",
      "offline": "Estamos fuera de línea. Déjanos un mensaje."
    },
    "notifications": {
      "enabled": true,
      "sound": false
    }
  }'
```

**Campos disponibles:**
- `color`: `"blue" | "orange" | "green" | "red" | "grey" | "purple"`
- `position`: `"left" | "right"`
- `text.welcome`: Mensaje de bienvenida (string)
- `text.offline`: Mensaje cuando está offline (string)
- `notifications.enabled`: Habilitar notificaciones (boolean)
- `notifications.sound`: Habilitar sonido (boolean)

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Configuración actualizada exitosamente",
  "data": {
    "color": "blue",
    "position": "right",
    "text": {
      "welcome": "¡Bienvenido! ¿En qué puedo ayudarte?",
      "offline": "Estamos fuera de línea. Déjanos un mensaje."
    },
    "notifications": {
      "enabled": true,
      "sound": false
    }
  }
}
```

## ⚠️ Manejo de Errores

Si algo falla, recibirás una respuesta con `success: false`:

```json
{
  "success": false,
  "error": "Error de API de Crisp",
  "message": "Descripción del error",
  "details": {
    "statusCode": 401,
    "reason": "invalid_session"
  }
}
```

**Errores comunes:**
- `401` - Credenciales inválidas o plugin no activado
- `404` - Website ID no encontrado
- `500` - Error del servidor de Crisp

## 🚀 Probar desde el Navegador

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre en el navegador:
   - Prueba: http://localhost:3002/api/crisp/test
   - Chatbox: http://localhost:3002/api/crisp/chatbox

3. Para actualizar, usa herramientas como:
   - [Postman](https://www.postman.com/)
   - [Insomnia](https://insomnia.rest/)
   - O el comando `curl` desde la terminal

## 📝 Notas

- Estas rutas están diseñadas para **desarrollo y pruebas**
- En producción, considera agregar autenticación/autorización
- Los cambios se aplican inmediatamente al chatbox en vivo
- Las credenciales deben estar en `.env.local`

