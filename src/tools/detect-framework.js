import { detectFramework } from "../core/framework-detector.js";

export default {
    name: "detect_framework",
    description: "Detecta automáticamente el framework y dominio del proyecto",

    handler: async ({ path, domain }) => {
        try {
            const result = await detectFramework(path, domain);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2)
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: error.message
                    }
                ],
                isError: true
            };
        }
    }
};