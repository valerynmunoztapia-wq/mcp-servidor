import test from "node:test";
import assert from "node:assert/strict";

import analyzeReportTool
    from "../../src/tools/analyze-report.js";

test("analyze_report expone metadata MCP válida", () => {
    assert.equal(
        analyzeReportTool.name,
        "analyze_report"
    );

    assert.equal(
        typeof analyzeReportTool.description,
        "string"
    );

    assert.equal(
        typeof analyzeReportTool.handler,
        "function"
    );
});

test("analyze_report tiene descripción", () => {
    assert.ok(
        analyzeReportTool.description.length > 0
    );
});
test("analyze_report tiene metadata válida", () => {
    assert.equal(
        analyzeReportTool.name,
        "analyze_report"
    );
});
