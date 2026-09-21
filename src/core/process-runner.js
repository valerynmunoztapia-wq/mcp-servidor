import { spawn } from "node:child_process";
import defaults from "../../config/defaults.js";
import { ExecutionTimeoutError } from "./errors.js";

export async function runProcess({
  command,
  args = [],
  cwd,
  timeoutMs = defaults.commandTimeoutMs,
  env = {},
  correlationId
}) {
  return await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
      shell: false
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => {
        if (child.exitCode === null && child.signalCode === null) {
          child.kill("SIGKILL");
        }
      }, 500);
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (exitCode, signal) => {
      clearTimeout(timer);

      if (timedOut) {
        reject(
          new ExecutionTimeoutError(`${command} ${args.join(" ")}`.trim(), timeoutMs, {
            correlationId
          })
        );
        return;
      }

      resolve({
        success: exitCode === 0,
        exitCode,
        signal,
        stdout,
        stderr,
        output: [stdout, stderr].filter(Boolean).join("\n").trim()
      });
    });
  });
}

export default runProcess;
