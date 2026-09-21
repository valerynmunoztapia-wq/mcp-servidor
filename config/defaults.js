export const defaults = {
  logLevel: process.env.LOG_LEVEL ?? "info",
  commandTimeoutMs: Number(process.env.MCP_COMMAND_TIMEOUT_MS ?? 120000),
  reportDirectory: process.env.MCP_REPORT_DIRECTORY ?? "reports",
  defaultReportName: process.env.MCP_DEFAULT_REPORT_NAME ?? "report.txt"
};

export default defaults;
