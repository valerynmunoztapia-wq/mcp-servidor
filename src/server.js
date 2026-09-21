import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./registry/tools.js";

export async function main() {
  const server = new McpServer({
    name: "mcp-servidor",
    version: "2.0.0"
  });

  registerTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  main().catch((error) => {
    process.stderr.write(`Error al iniciar el servidor MCP: ${error.message}\n`);
    process.exit(1);
  });
}
