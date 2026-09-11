const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getMenuList,
  isMenuItemAvailable,
  buildSelectionMessage,
  listAvailableRepos,
  getRepoPath,
} = require("../server.js");

test("lista los frameworks web disponibles", () => {
  assert.deepEqual(getMenuList("web"), ["React", "Vue", "Angular", "Svelte"]);
});

test("valida un framework mobile sin importar mayúsculas", () => {
  assert.equal(isMenuItemAvailable("mobile", "flutter"), true);
  assert.equal(isMenuItemAvailable("mobile", "React Native"), true);
  assert.equal(isMenuItemAvailable("mobile", "Kotlin"), false);
});

test("genera mensajes de selección con opciones válidas e inválidas", () => {
  assert.match(buildSelectionMessage("web", "React"), /Framework Web "React" conectado/);
  assert.match(
    buildSelectionMessage("servicios", "NestJS"),
    /no está en el menú Servicios.*Express, FastAPI, Spring Boot, Django/
  );
});

test("lista repositorios disponibles y normaliza nombres", () => {
  assert.deepEqual(listAvailableRepos(), ["web", "mobile", "servicios"]);
  assert.equal(getRepoPath("WEB"), process.cwd());
  assert.equal(getRepoPath("services"), process.cwd());
  assert.equal(getRepoPath("repo-inexistente"), null);
});
