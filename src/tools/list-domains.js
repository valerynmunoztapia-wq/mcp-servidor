import frameworksByDomain from "../../config/frameworks.json" with { type: "json" };

export function buildListDomainTools() {
  return [
    {
      name: "menu_web",
      description: "Lista los frameworks disponibles en el menú Framework Web",
      handler: async () => ({
        content: [{ type: "text", text: JSON.stringify(frameworksByDomain.web, null, 2) }]
      })
    },
    {
      name: "menu_mobile",
      description: "Lista los frameworks disponibles en el menú Framework Mobile",
      handler: async () => ({
        content: [{ type: "text", text: JSON.stringify(frameworksByDomain.mobile, null, 2) }]
      })
    },
    {
      name: "menu_servicios",
      description: "Lista los frameworks disponibles en el menú Framework Servicios",
      handler: async () => ({
        content: [{ type: "text", text: JSON.stringify(frameworksByDomain.servicios, null, 2) }]
      })
    }
  ];
}

export default buildListDomainTools;
