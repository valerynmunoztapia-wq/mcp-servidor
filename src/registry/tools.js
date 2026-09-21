import buildListDomainTools from "../tools/list-domains.js";
import listRepositoriesTool from "../tools/list-repositories.js";
import runTestsTool from "../tools/run-tests.js";
import getReportTool from "../tools/get-report.js";
import detectFrameworkTool from "../tools/detect-framework.js";
import validateRepositoryTool from "../tools/validate-repository.js";
import analyzeReportTool from "../tools/analyze-report.js";

export function registerTools(server) {
  const toolDefinitions = [
    ...buildListDomainTools(),
    listRepositoriesTool,
    detectFrameworkTool,
    validateRepositoryTool,
    runTestsTool,
    getReportTool,
    analyzeReportTool
  ];

  for (const tool of toolDefinitions) {
    const config = { description: tool.description };
    if (tool.inputSchema) {
      config.inputSchema = tool.inputSchema;
    }

    server.registerTool(tool.name, config, tool.handler);
  }
}
export default registerTools;
