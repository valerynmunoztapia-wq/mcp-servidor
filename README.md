# MCP Servidor

Servidor **MCP (Model Context Protocol)** real, construido con el SDK oficial de Anthropic
(`@modelcontextprotocol/sdk`). Conecta tres menús de frameworks — **Web**, **Mobile** y
**Servicios** — que un cliente de IA (Claude Desktop, MCP Inspector, etc.) puede listar y usar.

A diferencia de una API REST tradicional, este servidor no expone rutas HTTP: expone
**tools** que hablan el protocolo MCP (JSON-RPC sobre stdio), que es como los asistentes de
IA descubren y ejecutan funciones externas.

## Herramientas (tools) disponibles

| Tool | Descripción |
|---|---|
| `menu_web` | Lista los frameworks del menú Web |
| `usar_framework_web` | Selecciona un framework Web (parámetro `nombre`) |
| `menu_mobile` | Lista los frameworks del menú Mobile |
| `usar_framework_mobile` | Selecciona un framework Mobile (parámetro `nombre`) |
| `menu_servicios` | Lista los frameworks del menú Servicios |
| `usar_framework_servicios` | Selecciona un framework de Servicios (parámetro `nombre`) |

## Cómo ejecutar

1. Instalar dependencias:
   ```
   npm install
   ```
2. Iniciar el servidor (queda escuchando por stdio, esperando a un cliente MCP):
   ```
   npm start
   ```

## Cómo probarlo

**Opción A — MCP Inspector (recomendado, tiene interfaz visual en el navegador):**
```
npx @modelcontextprotocol/inspector node server.js
```
Esto abre una página donde puedes ver las 6 tools, ejecutarlas y ver la respuesta.

**Opción B — Conectarlo a Claude Desktop:**
Edita `claude_desktop_config.json` y agrega:
```json
{
  "mcpServers": {
    "mcp-servidor": {
      "command": "node",
      "args": ["/ruta/absoluta/a/mcp-servidor/server.js"]
    }
  }
}

Reinicia Claude Desktop y las 6 tools aparecerán disponibles en el chat.

## Estructura de datos (`menu.json`)

```json
{
  "web": ["React", "Vue", "Angular", "Svelte"],
  "mobile": ["React Native", "Flutter", "Swift (iOS)", "Kotlin (Android)"],
  "servicios": ["Express", "FastAPI", "Spring Boot", "Django"]
}
tiene menú contextual