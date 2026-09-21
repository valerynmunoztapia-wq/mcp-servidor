import { randomUUID } from "node:crypto";
import { dispatch } from "../orchestrator/dispatcher.js";
import { ApplicationError } from "../core/errors.js";

function calculateRiskLevel(successRate) {
    if (successRate >= 95) {
        return "LOW";
    }

    if (successRate >= 80) {
        return "MEDIUM";
    }

    return "HIGH";
}

export default {
    name: "analyze_report",
    description: "Analiza un reporte de pruebas y calcula métricas QA",

    handler: async ({ repo }) => {
        const correlationId = randomUUID();

        try {
            const report = await dispatch(
                repo,
                "report",
                correlationId
            );

            const successRate =
                report.total === 0
                    ? 0
                    : Number(
                        ((report.passed / report.total) * 100)
                            .toFixed(2)
                    );

            const analysis = {
                repo,
                correlationId,
                total: report.total,
                passed: report.passed,
                failed: report.failed,
                skipped: report.skipped,
                successRate,
                riskLevel: calculateRiskLevel(successRate)
            };

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            analysis,
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