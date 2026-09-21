import path from "node:path";
import repositories from "../../config/repositories.json" with { type: "json" };
import { RepositoryNotFoundError } from "../core/errors.js";

export function listRepositories() {
  return repositories;
}

export function resolveRepository(repoId, correlationId) {
  const repository = repositories.find((item) => item.id === repoId);

  if (!repository) {
    throw new RepositoryNotFoundError(repoId, { correlationId });
  }

  return {
    ...repository,
    absolutePath: path.resolve(repository.path)
  };
}

export default resolveRepository;
