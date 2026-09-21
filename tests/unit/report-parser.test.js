import test from "node:test";
import assert from "node:assert/strict";
import { parseReportContent } from "../../src/core/report-parser.js";

test("report parser normaliza JUnit XML", () => {
  const report = parseReportContent(
    `<?xml version="1.0"?><testsuite tests="3" failures="1" skipped="1" time="1.2"><testcase name="ok"></testcase><testcase name="fail"><failure message="boom">stack</failure></testcase><testcase name="skip"><skipped/></testcase></testsuite>`,
    "junit-xml"
  );

  assert.deepEqual(report, {
    total: 3,
    passed: 1,
    failed: 1,
    skipped: 1,
    durationMs: 1200,
    failures: [{ name: "fail", message: "boom" }]
  });
});

test("report parser normaliza JSON de Jest", () => {
  const report = parseReportContent(
    JSON.stringify({
      numTotalTests: 2,
      numPassedTests: 1,
      numFailedTests: 1,
      numPendingTests: 0,
      numTodoTests: 0,
      testResults: [
        {
          startTime: 10,
          endTime: 30,
          assertionResults: [
            { status: "passed", title: "ok", fullName: "suite ok", failureMessages: [] },
            { status: "failed", title: "fail", fullName: "suite fail", failureMessages: ["expected true to be false"] }
          ]
        }
      ]
    }),
    "jest-json"
  );

  assert.deepEqual(report, {
    total: 2,
    passed: 1,
    failed: 1,
    skipped: 0,
    durationMs: 20,
    failures: [{ name: "suite fail", message: "expected true to be false" }]
  });
});

test("report parser normaliza salida de pytest", () => {
  const report = parseReportContent(
    `============================= test session starts =============================\n__ test_api __\nAssertionError: boom\n=========================== 1 failed, 2 passed, 1 skipped in 0.50s ===========================`,
    "pytest-text"
  );

  assert.deepEqual(report, {
    total: 4,
    passed: 2,
    failed: 1,
    skipped: 1,
    durationMs: 500,
    failures: [{ name: "test_api", message: "AssertionError: boom" }]
  });
});
