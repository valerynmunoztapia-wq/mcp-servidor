import { randomUUID } from "node:crypto";
import { dispatch } from "../orchestrator/dispatcher.js";
import { getReportInputSchema, schemaShape } from "../schemas/index.js";
import { ApplicationError } from "../core/errors.js";
import logger from "../core/logger.js";

function toMcpError(error, correlationId) {
  const applicationError = error instanceof ApplicationError
    ? error
    : new ApplicationError(error.message, { correlationId, cause: error });

  logger.error(applicationError.message, {
    correlationId,
    code: applicationError.code
  });

  return {
    content: [{ type: "text", text: `${applicationError.message} [correlationId=${correlationId}]` }],
    isError: true
  };
}

async function ensureFrameworkMatchesRepository(repo, correlationId) {
  const detection = await dispatch(repo, "detect", correlationId);

  if (!detection?.framework) {
    throw new ApplicationError(`No fue posible detectar el framework del repositorio "${repo}".`, {
      correlationId
    });
  }
}

export default {
  name: "get_report",
  description: "Obtiene el reporte normalizado del repositorio indicado",
  inputSchema: schemaShape(getReportInputSchema),
  handler: async ({ repo }) => {
    const correlationId = randomUUID();

    try {
      await ensureFrameworkMatchesRepository(repo, correlationId);
      const result = await dispatch(repo, "report", correlationId);
      return {
        content: [{ type: "text", text: JSON.stringify({ correlationId, ...result }, null, 2) }]
      };
    } catch (error) {
      return toMcpError(error, correlationId);
    }
  }
};
