const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const menu = require("./menu.json");

// Servidor MCP: expone "tools" que un cliente de IA (Claude, etc.) puede llamar.
const server = new McpServer({
    name: "mcp-servidor",
    version: "1.0.0",
});

// --- MENÚ WEB ---
server.tool(
    "menu_web",
    "Lista los frameworks disponibles en el menú Framework Web",
    {},
    async () => ({
        content: [{ type: "text", text: JSON.stringify(menu.web, null, 2) }],
    })
);

server.tool(
    "usar_framework_web",
    "Selecciona y 'usa' un framework del menú Web",
    { nombre: z.string().describe("Nombre del framework web a usar, ej: React") },
    async ({ nombre }) => {
        const existe = menu.web.some(
            (f) => f.toLowerCase() === nombre.toLowerCase()
        );
        return {
            content: [
                {
                    type: "text",
                    text: existe
                        ? ` Framework Web "${nombre}" conectado y listo para usar.`
                        : ` "${nombre}" no está en el menú Web. Opciones: ${menu.web.join(", ")}`,
                },
            ],
        };
    }
);

// --- MENÚ MOBILE ---
server.tool(
    "menu_mobile",
    "Lista los frameworks disponibles en el menú Framework Mobile",
    {},
    async () => ({
        content: [{ type: "text", text: JSON.stringify(menu.mobile, null, 2) }],
    })
);

server.tool(
    "usar_framework_mobile",
    "Selecciona y 'usa' un framework del menú Mobile",
    { nombre: z.string().describe("Nombre del framework mobile a usar, ej: Flutter") },
    async ({ nombre }) => {
        const existe = menu.mobile.some(
            (f) => f.toLowerCase() === nombre.toLowerCase()
        );
        return {
            content: [
                {
                    type: "text",
                    text: existe
                        ? `✅ Framework Mobile "${nombre}" conectado y listo para usar.`
                        : `❌ "${nombre}" no está en el menú Mobile. Opciones: ${menu.mobile.join(", ")}`,
                },
            ],
        };
    }
);

// --- MENÚ SERVICIOS ---
server.tool(
    "menu_servicios",
    "Lista los frameworks disponibles en el menú Framework Servicios",
    {},
    async () => ({
        content: [{ type: "text", text: JSON.stringify(menu.servicios, null, 2) }],
    })
);

server.tool(
    "usar_framework_servicios",
    "Selecciona y 'usa' un framework del menú Servicios",
    { nombre: z.string().describe("Nombre del framework de servicios a usar, ej: Express") },
    async ({ nombre }) => {
        const existe = menu.servicios.some(
            (f) => f.toLowerCase() === nombre.toLowerCase()
        );
        return {
            content: [
                {
                    type: "text",
                    text: existe
                        ? ` Framework de Servicios "${nombre}" conectado y listo para usar.`
                        : `"${nombre}" no está en el menú Servicios. Opciones: ${menu.servicios.join(", ")}`,
                },
            ],
        };
    }
);

// El servidor se comunica por stdio (entrada/salida estándar),
// que es el transporte clásico de MCP para clientes como Claude Desktop.
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

// Los logs van a stderr: stdout está reservado para los mensajes JSON-RPC.
main().catch((error) => {
    console.error("Error al iniciar el servidor MCP:", error);
    process.exit(1);
});


