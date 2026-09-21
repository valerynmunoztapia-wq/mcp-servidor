import test from "node:test";
import assert from "node:assert/strict";

import validateRepositoryTool
    from "../../src/tools/validate-repository.js";

test("validate_repository expone metadata MCP válida", () => {
    assert.equal(
        validateRepositoryTool.name,
        "validate_repository"
    );

    assert.equal(
        typeof validateRepositoryTool.description,
        "string"
    );

    assert.equal(
        typeof validateRepositoryTool.handler,
        "function"
    );
});

test("validate_repository tiene descripción", () => {
    assert.ok(
        validateRepositoryTool.description.length > 0
    );
});
``
