import { z } from "zod";
import repositories from "../../config/repositories.json" with { type: "json" };

export const repositoryIds = repositories.map((repo) => repo.id);

const [firstRepositoryId, ...otherRepositoryIds] = repositoryIds;

export const repoIdSchema = z.enum([firstRepositoryId, ...otherRepositoryIds]);

export const runTestsInputSchema = z.object({
  repo: repoIdSchema
});

export const getReportInputSchema = z.object({
  repo: repoIdSchema
});

export const createFeatureInputSchema = z.object({
  repo: repoIdSchema,
  nombre: z.string().min(1)
});

export function schemaShape(schema) {
  return schema.shape;
}
