export class ApplicationError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code ?? "APPLICATION_ERROR";
    this.correlationId = options.correlationId ?? null;
    this.cause = options.cause;
  }
}

export class RepositoryNotFoundError extends ApplicationError {
  constructor(repoId, options = {}) {
    super(`Repositorio "${repoId}" no encontrado.`, {
      ...options,
      code: "REPOSITORY_NOT_FOUND"
    });
    this.repoId = repoId;
  }
}

export class UnsupportedFrameworkError extends ApplicationError {
  constructor(framework, domain, options = {}) {
    super(`Framework "${framework}" no soportado para el dominio "${domain}".`, {
      ...options,
      code: "UNSUPPORTED_FRAMEWORK"
    });
    this.framework = framework;
    this.domain = domain;
  }
}

export class ExecutionTimeoutError extends ApplicationError {
  constructor(command, timeoutMs, options = {}) {
    super(`La ejecución de "${command}" excedió el timeout de ${timeoutMs} ms.`, {
      ...options,
      code: "EXECUTION_TIMEOUT"
    });
    this.command = command;
    this.timeoutMs = timeoutMs;
  }
}

export class ValidationAppError extends ApplicationError {
  constructor(message, options = {}) {
    super(message, {
      ...options,
      code: "VALIDATION_ERROR"
    });
  }
}
