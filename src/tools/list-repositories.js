import { listRepositories } from "../orchestrator/repository-resolver.js";

export default {
  name: "listar_repos",
  description: "Lista los repositorios disponibles",
  handler: async () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          listRepositories().map(({ id, domain, framework, path }) => ({ id, domain, framework, path })),
          null,
          2
        )
      }
    ]
  })
};
