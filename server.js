const fs = require("node:fs");
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const menu = require("./menu.json");

const execFileAsync = promisify(execFile);
const repoAliases = {
    web: "web",
    mobile: "mobile",
    servicios: "servicios",
    services: "servicios",
    "servicio": "servicios",
};

const repos = {
    web: process.env.REPO_WEB || process.cwd(),
    mobile: process.env.REPO_MOBILE || process.cwd(),
    servicios: process.env.REPO_SERVICIOS || process.cwd(),
};

function getMenuList(section) {
    return menu[section] ?? [];
}

function normalizeName(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
}

function isMenuItemAvailable(section, nombre) {
    const opciones = getMenuList(section);
    const valor = normalizeName(nombre).toLowerCase();
    return opciones.some((f) => f.toLowerCase() === valor);
}

function buildSelectionMessage(section, nombre) {
    const opciones = getMenuList(section);
    const valor = normalizeName(nombre);
    const etiqueta = {
        web: "Framework Web",
        mobile: "Framework Mobile",
        servicios: "Framework de Servicios",
    }[section] ?? "Framework";

    if (isMenuItemAvailable(section, valor)) {
        return `${etiqueta} "${valor}" conectado y listo para usar.`;
    }

    return `"${valor}" no está en el menú ${section === "servicios" ? "Servicios" : section.charAt(0).toUpperCase() + section.slice(1)}. Opciones: ${opciones.join(", ")}`;
}

function listAvailableRepos() {
    return Object.keys(repos);
}

function getRepoPath(repo) {
    const valor = normalizeName(repo).toLowerCase();
    const mappedName = repoAliases[valor] || valor;
    const nombre = listAvailableRepos().find((item) => normalizeName(item).toLowerCase() === mappedName);

    if (!nombre) {
        return null;
    }

    return repos[nombre];
}

async function runCommand(command, args, cwd) {
    const executable = process.platform === "win32" && command.toLowerCase() === "npm" ? "npm.cmd" : command;
    const { stdout, stderr } = await execFileAsync(executable, args, {
        cwd,
        windowsHide: true,
        maxBuffer: 1024 * 1024,
    });

    return { stdout, stderr };
}

async function runProjectTests(repo) {
    const repoPath = getRepoPath(repo);
    if (!repoPath) {
        return `Repositorio "${repo}" no encontrado. Disponibles: ${listAvailableRepos().join(", ")}`;
    }

    try {
        const packageJsonPath = path.join(repoPath, "package.json");
        const packageData = fs.existsSync(packageJsonPath) ? JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) : null;

        if (packageData && packageData.scripts && packageData.scripts.test) {
            const { stdout, stderr } = await runCommand("npm", ["test", "--", "--test"], repoPath);
            return (stdout || stderr || "No hubo salida.").trim() || "Pruebas ejecutadas.";
        }

        const { stdout, stderr } = await runCommand("node", ["--test"], repoPath);
        return (stdout || stderr || "No hubo salida.").trim() || "Pruebas ejecutadas.";
    } catch (error) {
        return `Error al ejecutar pruebas en ${repo}: ${error.message}`;
    }
}

async function clearGradleCache(repo) {
    const repoPath = getRepoPath(repo);
    if (!repoPath) {
        return `Repositorio "${repo}" no encontrado. Disponibles: ${listAvailableRepos().join(", ")}`;
    }

    const gradleDir = path.join(repoPath, ".gradle");
    if (!fs.existsSync(gradleDir)) {
        return `No existe cache Gradle en ${repo}.`;
    }

    fs.rmSync(gradleDir, { recursive: true, force: true });
    return `Cache Gradle eliminada en ${repo}.`;
}

function createFeatureFile(repo, featureName) {
    const repoPath = getRepoPath(repo);
    if (!repoPath) {
        return `Repositorio "${repo}" no encontrado. Disponibles: ${listAvailableRepos().join(", ")}`;
    }

    const safeName = String(featureName || "feature").trim() || "feature";
    const fileName = `${safeName.replace(/\s+/g, "-").toLowerCase()}.feature`;
    const featuresDir = path.join(repoPath, "features");
    fs.mkdirSync(featuresDir, { recursive: true });

    const filePath = path.join(featuresDir, fileName);
    const content = [
        "# language: es",
        "",
        `Característica: ${safeName}`,
        "Como usuario",
        "Quiero usar esta funcionalidad",
        "Para obtener el resultado esperado",
        "",
        "Escenario: Caso básico",
        "Dado que el sistema está disponible",
        "Cuando ejecuto la acción principal",
        "Entonces obtengo el resultado esperado",
        "",
    ].join("\n");

    fs.writeFileSync(filePath, content, "utf8");
    return `Feature creado en ${filePath}`;
}

// Servidor MCP: expone "tools" que un cliente de IA (Claude, etc.) puede llamar.
const server = new McpServer({
    name: "mcp-servidor",
    version: "1.0.0",
});

// --- MENÚ WEB ---
server.tool(
    "menu_web",
    "Lista los frameworks disponibles en el menú Framework Web",
    {},
    async () => ({
        content: [{ type: "text", text: JSON.stringify(menu.web, null, 2) }],
    })
);

server.tool(
    "usar_framework_web",
    "Selecciona y 'usa' un framework del menú Web",
    { nombre: z.string().describe("Nombre del framework web a usar, ej: React") },
    async ({ nombre }) => ({
        content: [{ type: "text", text: buildSelectionMessage("web", nombre) }],
    })
);

// --- MENÚ MOBILE ---
server.tool(
    "menu_mobile",
    "Lista los frameworks disponibles en el menú Framework Mobile",
    {},
    async () => ({
        content: [{ type: "text", text: JSON.stringify(menu.mobile, null, 2) }],
    })
);

server.tool(
    "usar_framework_mobile",
    "Selecciona y 'usa' un framework del menú Mobile",
    { nombre: z.string().describe("Nombre del framework mobile a usar, ej: Flutter") },
    async ({ nombre }) => ({
        content: [{ type: "text", text: buildSelectionMessage("mobile", nombre) }],
    })
);

// --- MENÚ SERVICIOS ---
server.tool(
    "menu_servicios",
    "Lista los frameworks disponibles en el menú Framework Servicios",
    {},
    async () => ({
        content: [{ type: "text", text: JSON.stringify(menu.servicios, null, 2) }],
    })
);

server.tool(
    "usar_framework_servicios",
    "Selecciona y 'usa' un framework del menú Servicios",
    { nombre: z.string().describe("Nombre del framework de servicios a usar, ej: Express") },
    async ({ nombre }) => ({
        content: [{ type: "text", text: buildSelectionMessage("servicios", nombre) }],
    })
);

// El servidor se comunica por stdio (entrada/salida estándar),
// que es el transporte clásico de MCP para clientes como Claude Desktop.
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

module.exports = {
    server,
    menu,
    repos,
    getMenuList,
    normalizeName,
    isMenuItemAvailable,
    buildSelectionMessage,
    listAvailableRepos,
    getRepoPath,
    runProjectTests,
    clearGradleCache,
    createFeatureFile,
    main,
};

if (require.main === module) {
    // Los logs van a stderr: stdout está reservado para los mensajes JSON-RPC.
    main().catch((error) => {
        console.error("Error al iniciar el servidor MCP:", error);
        process.exit(1);
    });
}
// --- REPOSITORIOS ---
server.tool(
    "listar_repos",
    "Lista los repositorios disponibles",
    {},
    async () => ({
        content: [{ type: "text", text: JSON.stringify(listAvailableRepos(), null, 2) }],
    })
);

server.tool(
    "git_status",
    "Consulta el estado Git de un repositorio",
    { repo: z.string().describe("Nombre del repositorio: web, mobile, servicios") },
    async ({ repo }) => {
        const repoPath = getRepoPath(repo);
        if (!repoPath) {
            return { content: [{ type: "text", text: `Repositorio "${repo}" no encontrado. Disponibles: ${listAvailableRepos().join(", ")}` }] };
        }

        try {
        const gitDir = path.join(repoPath, ".git");
        if (!fs.existsSync(gitDir)) {
            return { content: [{ type: "text", text: `El repositorio ${repo} no es un repo Git válido.` }] };
        }

        const { stdout, stderr } = await runCommand("git", ["--no-pager", "status", "--short", "--branch"], repoPath);
        return { content: [{ type: "text", text: (stdout || stderr || "Sin cambios").trim() || "Sin cambios" }] };
    } catch (error) {
        return { content: [{ type: "text", text: `Error al consultar el estado Git de ${repo}: ${error.message}` }] };
    }
}
);

// --- PRUEBAS ---
server.tool(
    "run_tests",
    "Ejecuta pruebas en un repositorio",
    { repo: z.string().describe("Nombre del repositorio") },
    async ({ repo }) => ({
        content: [{ type: "text", text: await runProjectTests(repo) }],
    })
);

server.tool(
    "run_all_tests",
    "Ejecuta toda la suite de pruebas",
    { repo: z.string().describe("Nombre del repositorio") },
    async ({ repo }) => ({
        content: [{ type: "text", text: await runProjectTests(repo) }],
    })
);

// --- AUTOMATIZACIÓN ---
server.tool(
    "limpiar_gradle",
    "Limpia la cache de Gradle",
    { repo: z.string().describe("Nombre del repositorio") },
    async ({ repo }) => ({
        content: [{ type: "text", text: await clearGradleCache(repo) }],
    })
);

server.tool(
    "reiniciar_webdriver",
    "Reinicia el WebDriver",
    {},
    async () => ({ content: [{ type: "text", text: "WebDriver reiniciado (sin proceso activo en este entorno)." }] })
);

server.tool(
    "crear_feature",
    "Genera un nuevo feature Gherkin",
    {
        repo: z.string().describe("Nombre del repositorio: web, mobile, servicios"),
        nombre: z.string().describe("Nombre del feature"),
    },
    async ({ repo, nombre }) => ({
        content: [{ type: "text", text: createFeatureFile(repo, nombre) }],
    })
);

