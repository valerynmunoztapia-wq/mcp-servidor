export default {
    name: "generate_gherkin",
    description: "Genera escenarios Gherkin básicos a partir de un requisito",

    handler: async ({ requirement }) => {

        const gherkin = `
Feature: ${requirement}

Scenario: Flujo principal
  Given el usuario cumple las precondiciones
  When ejecuta la acción principal
  Then el resultado esperado se cumple
`.trim();

        return {
            content: [
                {
                    type: "text",
                    text: gherkin
                }
            ]
        };
    }
};