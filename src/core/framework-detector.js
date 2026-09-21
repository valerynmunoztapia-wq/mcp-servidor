import fs from "node:fs/promises";
import path from "node:path";
import frameworksByDomain from "../../config/frameworks.json" with { type: "json" };

const detectors = [
  {
    domain: "web",
    framework: "Selenium-Cucumber",
    files: ["build.gradle", "build.gradle.kts"],
    match: (files) =>
        [files["build.gradle"], files["build.gradle.kts"]]
            .filter(Boolean)
            .some((content) => content.toLowerCase().includes("selenium-java"))
  },
  {
    domain: "servicios",
    framework: "Gradle-Cucumber",
    files: ["build.gradle", "build.gradle.kts"],
    match: (files) =>
        [files["build.gradle"], files["build.gradle.kts"]]
            .filter(Boolean)
            .some((content) => content.toLowerCase().includes("io.cucumber") && !content.toLowerCase().includes("io.appium"))
  },
  {
    domain: "mobile",
    framework: "Appium-Cucumber",
    files: ["build.gradle", "build.gradle.kts"],
    match: (files) =>
        [files["build.gradle"], files["build.gradle.kts"]]
            .filter(Boolean)
            .some((content) => content.toLowerCase().includes("io.appium") && content.toLowerCase().includes("cucumber"))
  }
];

async function readOptionalFile(basePath, relativeFile) {
  try {
    const absolutePath = path.join(basePath, relativeFile);
    return await fs.readFile(absolutePath, "utf8");
  } catch {
    return null;
  }
}

export async function detectFramework(repoPath, expectedDomain) {
  const supportedFrameworks = frameworksByDomain[expectedDomain] ?? [];

  if (supportedFrameworks.length === 0) {
    return null;
  }

  for (const detector of detectors.filter((candidate) => candidate.domain === expectedDomain)) {
    const files = {};

    for (const file of detector.files) {
      files[file] = await readOptionalFile(repoPath, file);
    }

    if (!detector.match(files)) {
      continue;
    }

    if (!supportedFrameworks.includes(detector.framework)) {
      return null;
    }

    return {
      domain: detector.domain,
      framework: detector.framework,
      confidence: 0.95
    };
  }

  return null;
}

export default detectFramework;
