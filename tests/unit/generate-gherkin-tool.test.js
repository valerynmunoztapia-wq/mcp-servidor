import test from "node:test";
import assert from "node:assert/strict";

import generateGherkinTool
    from "../../src/tools/generate-gherkin.js";

test("generate_gherkin expone metadata MCP válida", () => {

    assert.equal(
        generateGherkinTool.name,
        "generate_gherkin"
    );

    assert.equal(
        typeof generateGherkinTool.description,
        "string"
    );

    assert.equal(
        typeof generateGherkinTool.handler,
        "function"
    );
});

test("generate_gherkin genera texto Gherkin", async () => {

    const result =
        await generateGherkinTool.handler({
            requirement: "Login de usuario"
        });

    assert.ok(
        result.content[0].text.includes("Feature:")
    );

    assert.ok(
        result.content[0].text.includes("Scenario:")
    );
});