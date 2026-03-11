#!/bin/bash
# =============================================================================
# Auto-check: detecta si los prompts INTEGRA están instalados en VS Code
# =============================================================================
# Se ejecuta automáticamente al abrir el proyecto en VS Code (via tasks.json).
# Si faltan prompts o están desactualizados, los instala silenciosamente.
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROMPTS_SRC="$SCRIPT_DIR/prompts"

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

# Verificar si faltan o están desactualizados
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

# Si todo está al día, salir silenciosamente
[ $NEEDS_INSTALL -eq 0 ] && exit 0

# Instalar/actualizar
mkdir -p "$PROMPTS_DIR"
INSTALLED=0
UPDATED=0

for f in "$PROMPTS_SRC"/*.md; do
    fname=$(basename "$f")
    if [ ! -f "$PROMPTS_DIR/$fname" ]; then
        cp "$f" "$PROMPTS_DIR/$fname"
        INSTALLED=$((INSTALLED + 1))
    elif ! diff -q "$f" "$PROMPTS_DIR/$fname" > /dev/null 2>&1; then
        cp "$f" "$PROMPTS_DIR/$fname"
        UPDATED=$((UPDATED + 1))
    fi
done

echo "🧬 INTEGRA: $INSTALLED prompts instalados, $UPDATED actualizados."
