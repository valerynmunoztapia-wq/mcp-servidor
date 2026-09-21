import test from "node:test";
import assert from "node:assert/strict";
import { buildExecutionContext } from "../../src/orchestrator/dispatcher.js";
import { RepositoryNotFoundError } from "../../src/core/errors.js";

test("dispatcher resuelve el adapter por dominio sin conocer el framework", () => {
  const context = buildExecutionContext("framework--servicios", "corr-1");
  assert.equal(context.repository.domain, "servicios");
  assert.equal(typeof context.adapter.detect, "function");
  assert.equal(typeof context.adapter.install, "function");
  assert.equal(typeof context.adapter.test, "function");
  assert.equal(typeof context.adapter.report, "function");
});

test("dispatcher falla con error tipado para repositorio inexistente", () => {
  assert.throws(
      () => buildExecutionContext("repo-inexistente", "corr-2"),
      (error) => error instanceof RepositoryNotFoundError
  );
});
