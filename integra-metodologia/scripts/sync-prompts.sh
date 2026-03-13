#!/bin/bash
# =============================================================================
# Sincronizar prompts de agentes INTEGRA v3.1.0 con VS Code
# =============================================================================
# Uso: ./sync-prompts.sh
# Copia los prompts del repo a la carpeta de VS Code del usuario.
# Detecta automáticamente: Linux, macOS, Windows, Codespaces.
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROMPTS_SRC="$SCRIPT_DIR/prompts"

if [ ! -d "$PROMPTS_SRC" ]; then
    echo -e "${RED}Error: No se encontró $PROMPTS_SRC${NC}"
    exit 1
fi

# Detectar ruta según entorno
if [ -n "$CODESPACES" ] || [ -n "$CLOUDENV_ENVIRONMENT_ID" ]; then
    PROMPTS_DIR="$HOME/.config/Code/User/prompts"
    ENTORNO="Codespaces"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PROMPTS_DIR="$HOME/Library/Application Support/Code/User/prompts"
    ENTORNO="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PROMPTS_DIR="$HOME/.config/Code/User/prompts"
    ENTORNO="Linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    PROMPTS_DIR="$APPDATA/Code/User/prompts"
    ENTORNO="Windows"
else
    echo -e "${RED}Error: SO no detectado. Copia manualmente prompts/ a tu carpeta de VS Code.${NC}"
    exit 1
fi

echo -e "${GREEN}🧬 INTEGRA v3.1.0 — Sincronización de Prompts${NC}"
echo "   Entorno: $ENTORNO"
echo "   Origen:  $PROMPTS_SRC"
echo "   Destino: $PROMPTS_DIR"
echo ""

mkdir -p "$PROMPTS_DIR"

UPDATED=0
INSTALLED=0
UNCHANGED=0

for f in "$PROMPTS_SRC"/*.md; do
    fname=$(basename "$f")
    if [ -f "$PROMPTS_DIR/$fname" ]; then
        if ! diff -q "$f" "$PROMPTS_DIR/$fname" > /dev/null 2>&1; then
            cp "$f" "$PROMPTS_DIR/$fname"
            echo -e "   ${YELLOW}↻ Actualizado:${NC} $fname"
            UPDATED=$((UPDATED + 1))
        else
            UNCHANGED=$((UNCHANGED + 1))
        fi
    else
        cp "$f" "$PROMPTS_DIR/$fname"
        echo -e "   ${GREEN}+ Instalado:${NC} $fname"
        INSTALLED=$((INSTALLED + 1))
    fi
done

echo ""
echo -e "${GREEN}✓ Resultado: $INSTALLED instalados, $UPDATED actualizados, $UNCHANGED sin cambios${NC}"

# =============================================================================
# Sincronizar hooks de agentes a ~/.integra/hooks/
# =============================================================================
HOOKS_SRC="$SCRIPT_DIR/scripts/hooks"
HOOKS_DIR="$HOME/.integra/hooks"

if [ -d "$HOOKS_SRC" ]; then
    echo ""
    echo -e "${GREEN}🪝 Sincronizando hooks de agentes...${NC}"
    echo "   Origen:  $HOOKS_SRC"
    echo "   Destino: $HOOKS_DIR"
    echo ""

    mkdir -p "$HOOKS_DIR"

    H_UPDATED=0
    H_INSTALLED=0
    H_UNCHANGED=0

    for f in "$HOOKS_SRC"/*.sh; do
        [ -f "$f" ] || continue
        fname=$(basename "$f")
        if [ -f "$HOOKS_DIR/$fname" ]; then
            if ! diff -q "$f" "$HOOKS_DIR/$fname" > /dev/null 2>&1; then
                cp "$f" "$HOOKS_DIR/$fname"
                chmod +x "$HOOKS_DIR/$fname"
                echo -e "   ${YELLOW}↻ Actualizado:${NC} $fname"
                H_UPDATED=$((H_UPDATED + 1))
            else
                H_UNCHANGED=$((H_UNCHANGED + 1))
            fi
        else
            cp "$f" "$HOOKS_DIR/$fname"
            chmod +x "$HOOKS_DIR/$fname"
            echo -e "   ${GREEN}+ Instalado:${NC} $fname"
            H_INSTALLED=$((H_INSTALLED + 1))
        fi
    done

    echo ""
    echo -e "${GREEN}✓ Hooks: $H_INSTALLED instalados, $H_UPDATED actualizados, $H_UNCHANGED sin cambios${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠ No se encontró $HOOKS_SRC — hooks no instalados${NC}"
fi
