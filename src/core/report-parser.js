const EMPTY_REPORT = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  durationMs: 0,
  failures: []
};

function toNumber(value) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDurationMs(secondsLike) {
  const numeric = Number(secondsLike ?? 0);
  return Number.isFinite(numeric) ? Math.round(numeric * 1000) : 0;
}

function parseAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/(\w+)="([^"]*)"/g)) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

function parseJUnitXml(content) {
  const suiteTag = content.match(/<testsuite\b([^>]*)>/i) ?? content.match(/<testsuites\b([^>]*)>/i);
  const suiteAttributes = suiteTag ? parseAttributes(suiteTag[1]) : {};
  const failures = [];

  for (const match of content.matchAll(/<testcase\b([^>]*)>([\s\S]*?)<\/testcase>/gi)) {
    const attributes = parseAttributes(match[1]);
    const body = match[2];
    const failureMatch = body.match(/<(failure|error)\b[^>]*message="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/i);

    if (failureMatch) {
      failures.push({
        name: attributes.name ?? "unknown",
        message: failureMatch[2] || failureMatch[3].trim()
      });
    }
  }

  const total = toNumber(suiteAttributes.tests);
  const failed = toNumber(suiteAttributes.failures) + toNumber(suiteAttributes.errors);
  const skipped = toNumber(suiteAttributes.skipped);

  return {
    total,
    passed: Math.max(total - failed - skipped, 0),
    failed,
    skipped,
    durationMs: toDurationMs(suiteAttributes.time),
    failures
  };
}

function parseJestJson(content) {
  const parsed = JSON.parse(content);
  const failures = [];
  const durationMs = (parsed.testResults ?? []).reduce(
    (accumulator, suite) => accumulator + Math.max(toNumber(suite.endTime) - toNumber(suite.startTime), 0),
    0
  );

  for (const suite of parsed.testResults ?? []) {
    for (const assertion of suite.assertionResults ?? []) {
      if (assertion.status === "failed") {
        failures.push({
          name: assertion.fullName ?? assertion.title ?? suite.name,
          message: (assertion.failureMessages ?? []).join("\n").trim()
        });
      }
    }
  }

  return {
    total: toNumber(parsed.numTotalTests),
    passed: toNumber(parsed.numPassedTests),
    failed: toNumber(parsed.numFailedTests),
    skipped: toNumber(parsed.numPendingTests) + toNumber(parsed.numTodoTests),
    durationMs,
    failures
  };
}

function parsePytestText(content) {
  const summaryMatch = content.match(/=+\s+([\d]+)\s+passed(?:,\s+([\d]+)\s+failed)?(?:,\s+([\d]+)\s+skipped)?(?:.*?in\s+([\d.]+)s)?\s+=+/i)
    ?? content.match(/=+\s+([\d]+)\s+failed,\s+([\d]+)\s+passed(?:,\s+([\d]+)\s+skipped)?(?:.*?in\s+([\d.]+)s)?\s+=+/i);

  if (!summaryMatch) {
    return { ...EMPTY_REPORT };
  }

  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let durationSeconds = 0;

  if (/failed/i.test(summaryMatch[0]) && summaryMatch.index !== undefined && /^=+\s+\d+\s+failed/i.test(summaryMatch[0])) {
    failed = toNumber(summaryMatch[1]);
    passed = toNumber(summaryMatch[2]);
    skipped = toNumber(summaryMatch[3]);
    durationSeconds = Number(summaryMatch[4] ?? 0);
  } else {
    passed = toNumber(summaryMatch[1]);
    failed = toNumber(summaryMatch[2]);
    skipped = toNumber(summaryMatch[3]);
    durationSeconds = Number(summaryMatch[4] ?? 0);
  }

  const failures = [...content.matchAll(/_{2,}\s+(.+?)\s+_{2,}[\r\n]+([\s\S]*?)(?=\n_{2,}|\n=+|\s*$)/g)].map((match) => ({
    name: match[1].trim(),
    message: match[2].trim()
  }));

  return {
    total: passed + failed + skipped,
    passed,
    failed,
    skipped,
    durationMs: toDurationMs(durationSeconds),
    failures
  };
}

export function parseReportContent(content, format) {
  if (!content) {
    return { ...EMPTY_REPORT };
  }

  switch (format) {
    case "junit-xml":
      return parseJUnitXml(content);
    case "jest-json":
      return parseJestJson(content);
    case "pytest-text":
      return parsePytestText(content);
    default:
      return { ...EMPTY_REPORT };
  }
}

export function detectReportFormat(content, reportPath = "") {
  const lowerPath = reportPath.toLowerCase();

  if (lowerPath.endsWith(".xml") || content.trim().startsWith("<")) {
    return "junit-xml";
  }

  if (lowerPath.endsWith(".json") || content.trim().startsWith("{")) {
    return "jest-json";
  }

  return "pytest-text";
}

export function parseReport({ content, reportPath }) {
  return parseReportContent(content, detectReportFormat(content, reportPath));
}

export default parseReport;
