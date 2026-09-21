import fs from "node:fs/promises";
import path from "node:path";
import { detectFramework } from "../../core/framework-detector.js";
import { runProcess } from "../../core/process-runner.js";
import parseReport from "../../core/report-parser.js";

async function readReport(context) {
  const absoluteReportPath = path.join(context.repository.absolutePath, context.repository.reportPath);
  const content = await fs.readFile(absoluteReportPath, "utf8");
  return {
    reportPath: absoluteReportPath,
    content
  };
}

export default {
  async detect(context) {
    const result = await detectFramework(context.repository.absolutePath, "mobile");
    return result ?? { framework: null, confidence: 0 };
  },
  async install(context) {
    return await runProcess({
      ...context.repository.commands.install,
      cwd: context.repository.absolutePath,
      correlationId: context.correlationId
    });
  },
  async test(context) {
    const execution = await runProcess({
      ...context.repository.commands.test,
      cwd: context.repository.absolutePath,
      correlationId: context.correlationId
    });

    return {
      success: execution.success,
      rawOutput: execution.output,
      reportPath: path.join(context.repository.absolutePath, context.repository.reportPath)
    };
  },
  async report(context) {
    const reportFile = await readReport(context);
    return parseReport(reportFile);
  }
};
