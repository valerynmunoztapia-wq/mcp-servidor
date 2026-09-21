import webDomain from "../domains/web/index.js";
import mobileDomain from "../domains/mobile/index.js";
import serviciosDomain from "../domains/servicios/index.js";
import { UnsupportedFrameworkError } from "../core/errors.js";
import { resolveRepository } from "./repository-resolver.js";

const domainAdapters = {
  web: webDomain,
  mobile: mobileDomain,
  servicios: serviciosDomain
};

export function buildExecutionContext(repoId, correlationId) {
  const repository = resolveRepository(repoId, correlationId);
  const adapter = domainAdapters[repository.domain];

  if (!adapter) {
    throw new UnsupportedFrameworkError(repository.framework, repository.domain, {
      correlationId
    });
  }

  return {
    correlationId,
    repository,
    adapter
  };
}

export async function dispatch(repoId, action, correlationId) {
  const context = buildExecutionContext(repoId, correlationId);
  return await context.adapter[action](context);
}

export default dispatch;
