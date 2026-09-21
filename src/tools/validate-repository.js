import { randomUUID } from "node:crypto";
import { dispatch } from "../orchestrator/dispatcher.js";
import { ApplicationError } from "../core/errors.js";

export default {
    name: "validate_repository",
    description: "Valida que el repositorio exista y que su framework pueda detectarse",

    handler: async ({ repo }) => {
        const correlationId = randomUUID();

        try {
            const detection = await dispatch(
                repo,
                "detect",
                correlationId
            );

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                valid: detection !== null,
                                repo,
                                correlationId,
                                ...(detection ?? {})
                            },
                            null,
                            2
                        )
                    }
                ]
            };
        } catch (error) {
            const applicationError =
                error instanceof ApplicationError
                    ? error
                    : new ApplicationError(error.message);

            return {
                content: [
                    {
                        type: "text",
                        text: applicationError.message
                    }
                ],
                isError: true
            };
        }
    }
};