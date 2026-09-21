import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { detectFramework } from "../../src/core/framework-detector.js";

async function withTempDir(setup) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "mcp-detector-"));
  try {
    await setup(directory);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

test("framework detector detecta Gradle-Cucumber desde build.gradle", async () => {
  await withTempDir(async (directory) => {
    await fs.writeFile(
        path.join(directory, "build.gradle"),
        "dependencies {\n  testImplementation 'io.cucumber:cucumber-java:7.14.0'\n}\n",
        "utf8"
    );
    const result = await detectFramework(directory, "servicios");
    assert.deepEqual(result, { domain: "servicios", framework: "Gradle-Cucumber", confidence: 0.95 });
  });
});

test("framework detector detecta Selenium-Cucumber desde build.gradle", async () => {
  await withTempDir(async (directory) => {
    await fs.writeFile(
        path.join(directory, "build.gradle"),
        "dependencies {\n  testImplementation 'org.seleniumhq.selenium:selenium-java:4.30.0'\n  testImplementation 'io.cucumber:cucumber-java:7.14.0'\n}\n",
        "utf8"
    );
    const result = await detectFramework(directory, "web");
    assert.deepEqual(result, { domain: "web", framework: "Selenium-Cucumber", confidence: 0.95 });
  });
});

test("framework detector detecta Appium-Cucumber desde build.gradle", async () => {
  await withTempDir(async (directory) => {
    await fs.writeFile(
        path.join(directory, "build.gradle"),
        "dependencies {\n  implementation \"io.appium:java-client:9.3.0\"\n  implementation \"io.cucumber:cucumber-java:7.18.0\"\n}\n",
        "utf8"
    );
    const result = await detectFramework(directory, "mobile");
    assert.deepEqual(result, { domain: "mobile", framework: "Appium-Cucumber", confidence: 0.95 });
  });
});

test("framework detector devuelve null cuando no encuentra coincidencias válidas", async () => {
  await withTempDir(async (directory) => {
    await fs.writeFile(path.join(directory, "build.gradle"), "dependencies {}\n", "utf8");
    const result = await detectFramework(directory, "servicios");
    assert.equal(result, null);
  });
});