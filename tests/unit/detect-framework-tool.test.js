import test from "node:test";
import assert from "node:assert/strict";

import detectFrameworkTool from "../../src/tools/detect-framework.js";

test("detect_framework expone metadata MCP válida", () => {
    assert.equal(detectFrameworkTool.name, "detect_framework");
    assert.equal(typeof detectFrameworkTool.description, "string");
    assert.equal(typeof detectFrameworkTool.handler, "function");
});

test("detect_framework tiene descripción no vacía", () => {
    assert.ok(detectFrameworkTool.description.length > 0);
});

test("detect_framework devuelve respuesta MCP válida", async () => {
    const result = await detectFrameworkTool.handler({
        path: "repositorio-inexistente",
        domain: "web"
    });

    assert.equal(typeof result, "object");
    assert.ok(Array.isArray(result.content));
});
test("detect_framework retorna content con tipo text", async () => {
    const result = await detectFrameworkTool.handler({
        path: "repositorio-inexistente",
        domain: "web"
    });

    assert.ok(Array.isArray(result.content));

    const firstItem = result.content[0];

    assert.equal(firstItem.type, "text");
    assert.equal(typeof firstItem.text, "string");
});
