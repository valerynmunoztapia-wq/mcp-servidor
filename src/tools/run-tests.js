import { randomUUID } from "node:crypto";
import { dispatch } from "../orchestrator/dispatcher.js";
import { runTestsInputSchema, schemaShape } from "../schemas/index.js";
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

export default {
  name: "run_tests",
  description: "Ejecuta las pruebas del repositorio indicado",
  inputSchema: schemaShape(runTestsInputSchema),
  handler: async ({ repo }) => {
    const correlationId = randomUUID();

    try {
      const result = await dispatch(repo, "test", correlationId);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                correlationId,
                ...result
              },
              null,
              2
            )
          }
        ],
        isError: result.success === false
      };
    } catch (error) {
      return toMcpError(error, correlationId);
    }
  }
};
