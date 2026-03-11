import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const SKILLS_DIR = 'skills';
const INSTRUCTIONS_DIR = 'instructions';
const GITHUB_DIR = '.github';

export function activate(context: vscode.ExtensionContext) {

    // Auto-sync al abrir cualquier workspace
    autoSync(context);

    // Verificar extensiones recomendadas
    checkRecommendedExtensions();

    // Sugerir GitHub Apps (solo una vez por sesión)
    suggestGitHubApps(context);

    // Comando: Inicializar proyecto completo
    context.subscriptions.push(
        vscode.commands.registerCommand('integra.initProject', () => initProject(context))
    );

    // Comando: Solo sincronizar skills + instructions
    context.subscriptions.push(
        vscode.commands.registerCommand('integra.syncSkills', () => syncSkills(context, true))
    );

    // Comando: Verificar GitHub Apps
    context.subscriptions.push(
        vscode.commands.registerCommand('integra.checkGitHubApps', () => showGitHubAppsInfo())
    );
}

/**
 * Auto-sync silencioso al abrir workspace.
 * Copia skills e instructions si faltan o están desactualizados.
 */
function autoSync(context: vscode.ExtensionContext): void {
    const workspaceFolder = getWorkspaceFolder();
    if (!workspaceFolder) { return; }

    // No actuar en el propio repo de INTEGRA
    if (isIntegraRepo(workspaceFolder)) { return; }

    const githubDir = path.join(workspaceFolder, GITHUB_DIR);
    const skillsDest = path.join(githubDir, SKILLS_DIR);
    const skillsSrc = path.join(context.extensionPath, 'resources', SKILLS_DIR);

    // Solo auto-sync si el proyecto ya tiene .github/ o PROYECTO.md (es un proyecto INTEGRA)
    const isIntegraProject = fs.existsSync(githubDir) || fs.existsSync(path.join(workspaceFolder, 'PROYECTO.md'));

    if (isIntegraProject) {
        const result = copyResourceDir(skillsSrc, skillsDest);
        const instrResult = copyInstructions(context, workspaceFolder);

        if (result.copied > 0 || result.updated > 0 || instrResult.copied > 0 || instrResult.updated > 0) {
            vscode.window.showInformationMessage(
                `🧬 INTEGRA: ${result.copied + instrResult.copied} instalados, ${result.updated + instrResult.updated} actualizados.`
            );
        }
    }
}

/**
 * Sincronizar skills + instructions manualmente (con feedback).
 */
function syncSkills(context: vscode.ExtensionContext, showFeedback: boolean): void {
    const workspaceFolder = getWorkspaceFolder();
    if (!workspaceFolder) {
        vscode.window.showWarningMessage('INTEGRA: No hay workspace abierto.');
        return;
    }

    const githubDir = path.join(workspaceFolder, GITHUB_DIR);
    const skillsDest = path.join(githubDir, SKILLS_DIR);
    const skillsSrc = path.join(context.extensionPath, 'resources', SKILLS_DIR);

    const result = copyResourceDir(skillsSrc, skillsDest);
    const instrResult = copyInstructions(context, workspaceFolder);
    const totalCopied = result.copied + instrResult.copied;
    const totalUpdated = result.updated + instrResult.updated;

    if (showFeedback) {
        if (totalCopied > 0 || totalUpdated > 0) {
            vscode.window.showInformationMessage(
                `🧬 INTEGRA: ${totalCopied} instalados, ${totalUpdated} actualizados.`
            );
        } else {
            vscode.window.showInformationMessage('🧬 INTEGRA: Todo está al día.');
        }
    }
}

/**
 * Inicializar un proyecto completo con estructura INTEGRA.
 */
async function initProject(context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolder = getWorkspaceFolder();
    if (!workspaceFolder) {
        vscode.window.showWarningMessage('INTEGRA: No hay workspace abierto.');
        return;
    }

    const projectName = await vscode.window.showInputBox({
        prompt: 'Nombre del proyecto',
        placeHolder: 'MiProyecto'
    });

    if (!projectName) { return; }

    // Crear estructura de carpetas
    const dirs = [
        'context/decisions',
        'context/interconsultas',
        'Checkpoints',
        '.github/skills',
        '.github/instructions'
    ];

    for (const dir of dirs) {
        fs.mkdirSync(path.join(workspaceFolder, dir), { recursive: true });
    }

    // Copiar skills e instructions
    syncSkills(context, false);

    // Crear PROYECTO.md si no existe
    const proyectoPath = path.join(workspaceFolder, 'PROYECTO.md');
    if (!fs.existsSync(proyectoPath)) {
        fs.writeFileSync(proyectoPath, getProyectoTemplate(projectName), 'utf8');
    }

    // Crear copilot-instructions.md si no existe
    const copilotPath = path.join(workspaceFolder, '.github', 'copilot-instructions.md');
    if (!fs.existsSync(copilotPath)) {
        fs.writeFileSync(copilotPath, getCopilotInstructionsTemplate(projectName), 'utf8');
    }

    vscode.window.showInformationMessage(`🧬 INTEGRA: Proyecto "${projectName}" inicializado.`);
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

function getWorkspaceFolder(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function isIntegraRepo(workspaceFolder: string): boolean {
    return fs.existsSync(path.join(workspaceFolder, 'integra-metodologia', 'prompts'));
}

interface CopyResult {
    copied: number;
    updated: number;
}

/**
 * Copia un directorio de recursos (skills) al destino.
 * Solo copia/actualiza lo que falta o cambió.
 */
function copyResourceDir(srcDir: string, destDir: string): CopyResult {
    const result: CopyResult = { copied: 0, updated: 0 };

    if (!fs.existsSync(srcDir)) { return result; }

    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        if (!entry.isDirectory()) { continue; }

        const srcSkill = path.join(srcDir, entry.name);
        const destSkill = path.join(destDir, entry.name);
        const srcFile = path.join(srcSkill, 'SKILL.md');

        if (!fs.existsSync(srcFile)) { continue; }

        const destFile = path.join(destSkill, 'SKILL.md');

        if (!fs.existsSync(destFile)) {
            fs.mkdirSync(destSkill, { recursive: true });
            copyDirContents(srcSkill, destSkill);
            result.copied++;
        } else if (filesDiffer(srcFile, destFile)) {
            copyDirContents(srcSkill, destSkill);
            result.updated++;
        }
    }

    return result;
}

/**
 * Copia instructions al proyecto.
 */
function copyInstructions(context: vscode.ExtensionContext, workspaceFolder: string): CopyResult {
    const result: CopyResult = { copied: 0, updated: 0 };
    const srcDir = path.join(context.extensionPath, 'resources', INSTRUCTIONS_DIR);
    const destDir = path.join(workspaceFolder, GITHUB_DIR, INSTRUCTIONS_DIR);

    if (!fs.existsSync(srcDir)) { return result; }

    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(destDir, file);

        if (!fs.existsSync(destFile)) {
            fs.mkdirSync(destDir, { recursive: true });
            fs.copyFileSync(srcFile, destFile);
            result.copied++;
        } else if (filesDiffer(srcFile, destFile)) {
            fs.copyFileSync(srcFile, destFile);
            result.updated++;
        }
    }

    return result;
}

function copyDirContents(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isFile()) {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function filesDiffer(file1: string, file2: string): boolean {
    try {
        const content1 = fs.readFileSync(file1, 'utf8');
        const content2 = fs.readFileSync(file2, 'utf8');
        return content1 !== content2;
    } catch {
        return true;
    }
}

function getProyectoTemplate(projectName: string): string {
    return `# 📋 PROYECTO: ${projectName}

> Fuente de verdad del proyecto. Mantenido por CRONISTA.

## Stack
- **Frontend:**
- **Backend:**
- **Base de datos:**
- **Hosting:**

---

## Backlog

### Sprint Actual

| ID | Tarea | Estado | Asignado | Prioridad |
|----|-------|--------|----------|-----------|
| | | [ ] Pendiente | | |

### Backlog General

| ID | Tarea | Estado | Prioridad |
|----|-------|--------|-----------|
| | | [ ] Pendiente | |

---

## Deuda Técnica

| ID | Descripción | Impacto | Sprint Target |
|----|-------------|---------|---------------|
| | | | |

---

## Historial de Cambios

| Fecha | ID | Descripción |
|-------|-----|-------------|
| | | |
`;
}

function getCopilotInstructionsTemplate(projectName: string): string {
    return `# Instrucciones de Proyecto: ${projectName}

## Stack
- **Frontend:**
- **Backend:**
- **Base de datos:**
- **Hosting:**

## Convenciones
- Idioma de código: español para variables de negocio, inglés para técnicas
- Commits en español (Conventional Commits)
- Metodología INTEGRA v3.1.0

## Contexto de Negocio
<!-- Completar durante Discovery o manualmente -->

## No Tocar
<!-- Archivos o módulos que NO deben modificarse sin autorización -->

## Comandos Verificados
- **Build:** \`npm run build\`
- **Test:** \`npm test\`
- **Dev:** \`npm run dev\`
`;
}

// ─── Verificación de Extensiones y GitHub Apps ───────────────────────────────

const RECOMMENDED_EXTENSIONS = [
    { id: 'GitHub.copilot', name: 'GitHub Copilot' },
    { id: 'GitHub.copilot-chat', name: 'GitHub Copilot Chat' },
    { id: 'Codium.codium', name: 'Qodo (AI Code Review)' }
];

/**
 * Verifica si las extensiones recomendadas están instaladas.
 * Si falta alguna, ofrece instalarla.
 */
function checkRecommendedExtensions(): void {
    const missing = RECOMMENDED_EXTENSIONS.filter(
        ext => !vscode.extensions.getExtension(ext.id)
    );

    if (missing.length === 0) { return; }

    const names = missing.map(e => e.name).join(', ');
    vscode.window.showInformationMessage(
        `🧬 INTEGRA: Faltan extensiones recomendadas: ${names}`,
        'Instalar todas',
        'Ignorar'
    ).then(selection => {
        if (selection === 'Instalar todas') {
            for (const ext of missing) {
                vscode.commands.executeCommand(
                    'workbench.extensions.installExtension',
                    ext.id
                );
            }
        }
    });
}

const GITHUB_APPS_KEY = 'integra.gitHubAppsSuggested';

/**
 * Sugiere instalar CodeRabbit y Qodo Merge como GitHub Apps.
 * Solo muestra la sugerencia una vez (usa globalState).
 */
function suggestGitHubApps(context: vscode.ExtensionContext): void {
    const alreadySuggested = context.globalState.get<boolean>(GITHUB_APPS_KEY);
    if (alreadySuggested) { return; }

    // Solo sugerir si hay un workspace abierto con .git
    const workspaceFolder = getWorkspaceFolder();
    if (!workspaceFolder || !fs.existsSync(path.join(workspaceFolder, '.git'))) { return; }

    // Verificar si ya tienen config de CodeRabbit o Qodo
    const hasCodeRabbit = fs.existsSync(path.join(workspaceFolder, '.coderabbit.yaml'));
    const hasQodoMerge = fs.existsSync(path.join(workspaceFolder, '.qodo.toml'));

    if (hasCodeRabbit && hasQodoMerge) {
        context.globalState.update(GITHUB_APPS_KEY, true);
        return;
    }

    const missingApps: string[] = [];
    if (!hasCodeRabbit) { missingApps.push('CodeRabbit'); }
    if (!hasQodoMerge) { missingApps.push('Qodo Merge'); }

    vscode.window.showInformationMessage(
        `🧬 INTEGRA recomienda instalar ${missingApps.join(' y ')} como GitHub Apps para revisión automática de PRs.`,
        'Ver instrucciones',
        'No mostrar más'
    ).then(selection => {
        if (selection === 'Ver instrucciones') {
            showGitHubAppsInfo();
        }
        if (selection === 'No mostrar más') {
            context.globalState.update(GITHUB_APPS_KEY, true);
        }
    });
}

/**
 * Muestra información sobre cómo instalar las GitHub Apps.
 */
function showGitHubAppsInfo(): void {
    const panel = vscode.window.createWebviewPanel(
        'integraGitHubApps',
        'INTEGRA: GitHub Apps',
        vscode.ViewColumn.One,
        {}
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); background: var(--vscode-editor-background); }
        h1 { color: var(--vscode-textLink-foreground); }
        h2 { margin-top: 24px; }
        a { color: var(--vscode-textLink-foreground); }
        .app { background: var(--vscode-editor-inactiveSelectionBackground); padding: 16px; border-radius: 8px; margin: 12px 0; }
        .app h3 { margin-top: 0; }
        code { background: var(--vscode-textCodeBlock-background); padding: 2px 6px; border-radius: 3px; }
        .steps { padding-left: 20px; }
        .steps li { margin: 8px 0; }
    </style>
</head>
<body>
    <h1>🧬 INTEGRA: GitHub Apps Recomendadas</h1>
    <p>Estas apps revisan automáticamente tus Pull Requests. Son gratuitas y complementan el trabajo de los agentes INTEGRA.</p>

    <div class="app">
        <h3>🐰 CodeRabbit — Revisión de código con IA</h3>
        <p><strong>Costo:</strong> Gratis (Open Source tier)</p>
        <ol class="steps">
            <li>Ve a <a href="https://github.com/apps/coderabbitai">github.com/apps/coderabbitai</a></li>
            <li>Click en <strong>"Install"</strong></li>
            <li>Selecciona tu cuenta/organización y los repos</li>
            <li>Crea un archivo <code>.coderabbit.yaml</code> en la raíz del repo (opcional)</li>
        </ol>
    </div>

    <div class="app">
        <h3>🔮 Qodo Merge — Revisión y descripción automática de PRs</h3>
        <p><strong>Costo:</strong> Gratis (Free Developer tier)</p>
        <ol class="steps">
            <li>Ve a <a href="https://github.com/apps/qodo-merge-pro">github.com/apps/qodo-merge-pro</a></li>
            <li>Click en <strong>"Install"</strong></li>
            <li>Selecciona tu cuenta/organización y los repos</li>
            <li>Crea un archivo <code>.qodo.toml</code> en la raíz del repo (opcional)</li>
        </ol>
    </div>

    <h2>¿Por qué usarlas?</h2>
    <p>INTEGRA tiene 3 capas de calidad:</p>
    <table>
        <tr><td><strong>Capa 1:</strong></td><td>Agentes INTEGRA (durante desarrollo)</td></tr>
        <tr><td><strong>Capa 2:</strong></td><td>CodeRabbit + Qodo Merge (en cada PR) ← <em>estas apps</em></td></tr>
        <tr><td><strong>Capa 3:</strong></td><td>Soft Gates + Qodo CLI (antes de cerrar tarea)</td></tr>
    </table>
</body>
</html>`;
}

export function deactivate() {}
