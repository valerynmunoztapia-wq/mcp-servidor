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
export function calculateCoverageLevel(linesCoverage) {
    if (linesCoverage >= 80) {
        return "GOOD";
    }

    if (linesCoverage >= 60) {
        return "MEDIUM";
    }

    return "LOW";
}
``
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

            const analysis = {
                repo,
                correlationId,
                total: report.total,
                passed: report.passed,
                failed: report.failed,
                skipped: report.skipped,
                successRate,
                riskLevel: calculateRiskLevel(successRate),
                coverageLevel: calculateCoverageLevel(coverage.lines)
            };
            const coverage = {
                lines: 82,
                branches: 76,
                functions: 91
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