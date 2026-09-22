import buildListDomainTools from "../tools/list-domains.js";
import listRepositoriesTool from "../tools/list-repositories.js";
import runTestsTool from "../tools/run-tests.js";
import getReportTool from "../tools/get-report.js";
import detectFrameworkTool from "../tools/detect-framework.js";
import validateRepositoryTool from "../tools/validate-repository.js";
import analyzeReportTool from "../tools/analyze-report.js";
import generateGherkinTool from "../tools/generate-gherkin.js";
export function registerTools(server) {
  const toolDefinitions = [
    ...buildListDomainTools(),
    listRepositoriesTool,
    detectFrameworkTool,
    validateRepositoryTool,
    runTestsTool,
    getReportTool,
    analyzeReportTool,
    generateGherkinTool
  ];

  for (const tool of toolDefinitions) {

    console.error(
        `[MCP] Tool registrada: ${tool.name}`
    );

    const config = {
      description: tool.description
    };

    if (tool.inputSchema) {
      config.inputSchema = tool.inputSchema;
    }

    server.registerTool(
        tool.name,
        config,
        wrapWithLogging(tool.name, tool.handler)
    );
  }
}

// Envuelve el handler de cada tool para loguear la llamada en stderr
// (stdout está reservado para el protocolo MCP vía stdio transport).
function wrapWithLogging(toolName, handler) {
  return async (...args) => {
    const startedAt = Date.now();
    process.stderr.write(`[tool-call] ${toolName} start args=${safeStringify(args[0])}\n`);
    try {
      const result = await handler(...args);
      process.stderr.write(
        `[tool-call] ${toolName} ok durationMs=${Date.now() - startedAt}\n`
      );
      return result;
    } catch (error) {
      process.stderr.write(
        `[tool-call] ${toolName} error durationMs=${Date.now() - startedAt} message=${error.message}\n`
      );
      throw error;
    }
  };
}

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return "[unserializable]";
  }
}
export default registerTools;
