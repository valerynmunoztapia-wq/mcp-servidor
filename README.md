# MCP Servidor

Orquestador MCP en Node.js para automatización de pruebas por repositorio, dominio y framework.

## Estructura

```text
mcp-servidor/
├── config/
│   ├── defaults.js
│   ├── frameworks.json
│   └── repositories.json
├── src/
│   ├── core/
│   ├── domains/
│   ├── orchestrator/
│   ├── registry/
│   ├── schemas/
│   ├── tools/
│   └── server.js
└── tests/unit/
```

## Migración sin romper nada

1. Mantén `menu.json` en la raíz y copia su contenido a `config/frameworks.json`.
2. Actualiza `package.json` a ES Modules y cambia el entrypoint a `src/server.js`.
3. Crea `config/repositories.json` con los repos reales y sus comandos `install` y `test`.
4. Mueve el arranque MCP a `src/server.js` y deja allí solo el bootstrap con `McpServer` y `StdioServerTransport`.
5. Registra las tools desde `src/registry/tools.js`, conservando los nombres ya expuestos que sigan vigentes.
6. Pasa la resolución de repositorios y el despacho por dominio a `src/orchestrator/`.
7. Implementa el contrato común de dominio en `src/domains/web`, `src/domains/mobile` y `src/domains/servicios`.
8. Centraliza ejecución de procesos, detección de framework, parsing de reportes, logging y errores tipados en `src/core/`.
9. Valida inputs con zod en `src/schemas/index.js`.
10. Mueve las pruebas unitarias a `tests/unit/` y cubre dispatcher, framework detector y report parser.
11. Actualiza `.mcp.json` para apuntar a `./src/server.js`.
12. Ejecuta `npm test`.

## Tools expuestas

| Tool | Descripción |
|---|---|
| `menu_web` | Lista frameworks del dominio web |
| `menu_mobile` | Lista frameworks del dominio mobile |
| `menu_servicios` | Lista frameworks del dominio servicios |
| `listar_repos` | Lista repositorios configurados |
| `run_tests` | Ejecuta pruebas del repositorio indicado |
| `get_report` | Devuelve el reporte normalizado del repositorio indicado |

## Configuración de repositorios

Ejemplo en `config/repositories.json`:

```json
{
  "id": "web-ejemplo",
  "domain": "web",
  "framework": "React",
  "path": "C:\\repos\\web-ejemplo",
  "commands": {
    "install": {
      "command": "npm",
      "args": ["install"]
    },
    "test": {
      "command": "npm",
      "args": ["test", "--", "--json", "--outputFile=reports\\jest-report.json"]
    }
  },
  "reportPath": "reports\\jest-report.json"
}
```
