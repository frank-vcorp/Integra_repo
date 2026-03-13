#!/bin/bash
# =============================================================================
# Auto-check: detecta si los prompts INTEGRA están instalados en VS Code
# y si el proyecto actual tiene los skills + instructions de INTEGRA.
# =============================================================================
# Se ejecuta automáticamente al abrir el proyecto en VS Code (via tasks.json).
# Parte 1: Sincroniza agentes globales (~/.config/Code/User/prompts/)
# Parte 2: Copia skills + instructions al proyecto actual (.github/)
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROMPTS_SRC="$SCRIPT_DIR/prompts"
SKILLS_SRC="$SCRIPT_DIR/.github/skills"
INSTRUCTIONS_SRC="$SCRIPT_DIR/.github/instructions"

# Detectar el directorio del proyecto actual (donde se abrió VS Code)
# Si se ejecuta desde tasks.json, ${workspaceFolder} es el cwd
PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"

# Salir silenciosamente si no hay fuente de prompts
[ ! -d "$PROMPTS_SRC" ] && exit 0

# Detectar ruta de prompts de VS Code según entorno
if [ -n "$CODESPACES" ] || [ -n "$CLOUDENV_ENVIRONMENT_ID" ]; then
    PROMPTS_DIR="$HOME/.config/Code/User/prompts"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PROMPTS_DIR="$HOME/Library/Application Support/Code/User/prompts"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PROMPTS_DIR="$HOME/.config/Code/User/prompts"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    PROMPTS_DIR="$APPDATA/Code/User/prompts"
else
    exit 0
fi

TOTAL_INSTALLED=0
TOTAL_UPDATED=0

# ─── PARTE 1: Sincronizar agentes globales ───────────────────────────────────

NEEDS_INSTALL=0
for f in "$PROMPTS_SRC"/*.md; do
    fname=$(basename "$f")
    if [ ! -f "$PROMPTS_DIR/$fname" ]; then
        NEEDS_INSTALL=1
        break
    elif ! diff -q "$f" "$PROMPTS_DIR/$fname" > /dev/null 2>&1; then
        NEEDS_INSTALL=1
        break
    fi
done

if [ $NEEDS_INSTALL -eq 1 ]; then
    mkdir -p "$PROMPTS_DIR"
    for f in "$PROMPTS_SRC"/*.md; do
        fname=$(basename "$f")
        if [ ! -f "$PROMPTS_DIR/$fname" ]; then
            cp "$f" "$PROMPTS_DIR/$fname"
            TOTAL_INSTALLED=$((TOTAL_INSTALLED + 1))
        elif ! diff -q "$f" "$PROMPTS_DIR/$fname" > /dev/null 2>&1; then
            cp "$f" "$PROMPTS_DIR/$fname"
            TOTAL_UPDATED=$((TOTAL_UPDATED + 1))
        fi
    done
fi

# ─── PARTE 2: Copiar skills al proyecto actual ───────────────────────────────
# Solo si: hay fuente de skills Y el proyecto no es Integra_repo
# Y el proyecto tiene un .git (es un repo real)

if [ -d "$SKILLS_SRC" ] && [ -d "$PROJECT_DIR/.git" ] && \
   [ "$(cd "$PROJECT_DIR" && basename "$(git rev-parse --show-toplevel)" 2>/dev/null)" != "Integra_repo" ]; then

    SKILLS_DEST="$PROJECT_DIR/.github/skills"
    SKILLS_COPIED=0

    for skill_dir in "$SKILLS_SRC"/*/; do
        skill_name=$(basename "$skill_dir")
        dest_dir="$SKILLS_DEST/$skill_name"
        if [ ! -d "$dest_dir" ]; then
            mkdir -p "$dest_dir"
            cp "$skill_dir"/* "$dest_dir/" 2>/dev/null
            SKILLS_COPIED=$((SKILLS_COPIED + 1))
        elif [ -f "$skill_dir/SKILL.md" ] && ! diff -q "$skill_dir/SKILL.md" "$dest_dir/SKILL.md" > /dev/null 2>&1; then
            cp "$skill_dir"/* "$dest_dir/" 2>/dev/null
            SKILLS_COPIED=$((SKILLS_COPIED + 1))
        fi
    done

    if [ $SKILLS_COPIED -gt 0 ]; then
        TOTAL_INSTALLED=$((TOTAL_INSTALLED + SKILLS_COPIED))
        echo "🧬 INTEGRA: $SKILLS_COPIED skills copiados a $SKILLS_DEST"
    fi
fi

# ─── PARTE 3: Copiar instructions al proyecto actual ─────────────────────────

if [ -d "$INSTRUCTIONS_SRC" ] && [ -d "$PROJECT_DIR/.git" ] && \
   [ "$(cd "$PROJECT_DIR" && basename "$(git rev-parse --show-toplevel)" 2>/dev/null)" != "Integra_repo" ]; then

    INSTRUCTIONS_DEST="$PROJECT_DIR/.github/instructions"
    INSTRUCTIONS_COPIED=0

    for f in "$INSTRUCTIONS_SRC"/*.md; do
        fname=$(basename "$f")
        dest_file="$INSTRUCTIONS_DEST/$fname"
        if [ ! -f "$dest_file" ]; then
            mkdir -p "$INSTRUCTIONS_DEST"
            cp "$f" "$dest_file"
            INSTRUCTIONS_COPIED=$((INSTRUCTIONS_COPIED + 1))
        elif ! diff -q "$f" "$dest_file" > /dev/null 2>&1; then
            cp "$f" "$dest_file"
            INSTRUCTIONS_COPIED=$((INSTRUCTIONS_COPIED + 1))
        fi
    done

    if [ $INSTRUCTIONS_COPIED -gt 0 ]; then
        TOTAL_INSTALLED=$((TOTAL_INSTALLED + INSTRUCTIONS_COPIED))
        echo "🧬 INTEGRA: $INSTRUCTIONS_COPIED instructions copiados a $INSTRUCTIONS_DEST"
    fi
fi

# ─── RESUMEN ──────────────────────────────────────────────────────────────────

if [ $TOTAL_INSTALLED -gt 0 ] || [ $TOTAL_UPDATED -gt 0 ]; then
    echo "🧬 INTEGRA: $TOTAL_INSTALLED instalados, $TOTAL_UPDATED actualizados."
fi
