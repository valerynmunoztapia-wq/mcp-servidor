import defaults from "../../config/defaults.js";

const levels = ["debug", "info", "warn", "error"];

function shouldLog(level) {
  return levels.indexOf(level) >= levels.indexOf(defaults.logLevel);
}

function write(level, message, meta = {}) {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };

  process.stderr.write(`${JSON.stringify(payload)}\n`);
}

export const logger = {
  debug(message, meta) {
    write("debug", message, meta);
  },
  info(message, meta) {
    write("info", message, meta);
  },
  warn(message, meta) {
    write("warn", message, meta);
  },
  error(message, meta) {
    write("error", message, meta);
  }
};

export default logger;
