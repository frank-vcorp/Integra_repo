#!/bin/bash
# =============================================================================
# INTEGRA — Instalar hooks en máquina remota (SSH/WSL/Container)
# =============================================================================
# Ejecutar en la máquina REMOTA para que los hooks funcionen via SSH tunnel.
# Uso: bash install-remote-hooks.sh
#   o: ssh usuario@servidor 'bash -s' < install-remote-hooks.sh
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

HOOKS_DIR="$HOME/.integra/hooks"

echo -e "${GREEN}🧬 INTEGRA v3.2.0 — Instalación de hooks remotos${NC}"
echo "   Destino: $HOOKS_DIR"
echo ""

mkdir -p "$HOOKS_DIR"

# --- session-context.sh ---
cat > "$HOOKS_DIR/session-context.sh" << 'HOOK_EOF'
#!/bin/bash
CONTEXT_PARTS=()
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "desconocida")
    CONTEXT_PARTS+=("Rama actual: $BRANCH")
fi
if [ -f "PROYECTO.md" ]; then
    CONTEXT_PARTS+=("PROYECTO.md detectado — consultar para estado del backlog.")
    IN_PROGRESS=$(grep -c '\[/\]' PROYECTO.md 2>/dev/null || echo "0")
    BLOCKED=$(grep -c '\[!\]' PROYECTO.md 2>/dev/null || echo "0")
    [ "$IN_PROGRESS" -gt 0 ] && CONTEXT_PARTS+=("Tareas en progreso: $IN_PROGRESS")
    [ "$BLOCKED" -gt 0 ] && CONTEXT_PARTS+=("ALERTA: $BLOCKED tareas bloqueadas.")
else
    CONTEXT_PARTS+=("No se detectó PROYECTO.md — considerar ejecutar Discovery si es proyecto nuevo.")
fi
if [ -d "context/interconsultas" ]; then
    PENDING=$(find context/interconsultas -name "*.md" -newer context/checkpoints 2>/dev/null | wc -l | tr -d ' ')
    [ "$PENDING" -gt 0 ] && CONTEXT_PARTS+=("Hay $PENDING interconsulta(s) reciente(s) en context/interconsultas/ — revisar antes de actuar.")
fi
if [ -d "context/checkpoints" ]; then
    LAST_CHK=$(ls -t context/checkpoints/CHK_*.md 2>/dev/null | head -1)
    [ -n "$LAST_CHK" ] && CONTEXT_PARTS+=("Último checkpoint: $(basename "$LAST_CHK")")
fi
if [ -f "package.json" ]; then CONTEXT_PARTS+=("Stack detectado: Node.js (package.json presente)")
elif [ -f "composer.json" ]; then CONTEXT_PARTS+=("Stack detectado: PHP/Composer (composer.json presente)")
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then CONTEXT_PARTS+=("Stack detectado: Python")
fi
JOINED=$(printf '%s. ' "${CONTEXT_PARTS[@]}")
JOINED=$(echo "$JOINED" | sed 's/"/\\"/g')
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "[INTEGRA SessionStart] $JOINED"
  }
}
EOF
HOOK_EOF

# --- sofia-stop-gate.sh ---
cat > "$HOOKS_DIR/sofia-stop-gate.sh" << 'HOOK_EOF'
#!/bin/bash
INPUT=$(cat)
STOP_ACTIVE=$(echo "$INPUT" | grep -o '"stop_hook_active"[[:space:]]*:[[:space:]]*true' || true)
if [ -n "$STOP_ACTIVE" ]; then
    cat <<EOF
{"hookSpecificOutput":{"hookEventName":"Stop"}}
EOF
    exit 0
fi
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "decision": "block",
    "reason": "[INTEGRA Soft Gates] Antes de finalizar, verifica los 4 Gates: (1) ¿Compila sin errores? (2) ¿Tests pasan? (3) ¿Ejecutaste qodo self-review? (4) ¿Generaste checkpoint en context/checkpoints/? Si ya los validaste, puedes finalizar."
  }
}
EOF
HOOK_EOF

# --- deby-stop-dictamen.sh ---
cat > "$HOOKS_DIR/deby-stop-dictamen.sh" << 'HOOK_EOF'
#!/bin/bash
INPUT=$(cat)
STOP_ACTIVE=$(echo "$INPUT" | grep -o '"stop_hook_active"[[:space:]]*:[[:space:]]*true' || true)
if [ -n "$STOP_ACTIVE" ]; then
    cat <<EOF
{"hookSpecificOutput":{"hookEventName":"Stop"}}
EOF
    exit 0
fi
DICTAMEN_FOUND=false
if [ -d "context/interconsultas" ]; then
    RECENT=$(find context/interconsultas -name "DICTAMEN_FIX-*.md" -mmin -60 2>/dev/null | head -1)
    [ -n "$RECENT" ] && DICTAMEN_FOUND=true
fi
if [ "$DICTAMEN_FOUND" = true ]; then
    cat <<EOF
{"systemMessage":"[INTEGRA] Dictamen detectado. Sesión de Deby finalizada correctamente.","hookSpecificOutput":{"hookEventName":"Stop"}}
EOF
else
    cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "decision": "block",
    "reason": "[INTEGRA Protocolo Forense] No se detectó un DICTAMEN_FIX-*.md reciente en context/interconsultas/. Genera el dictamen obligatorio antes de finalizar. Si ya lo creaste o no aplica, puedes terminar."
  }
}
EOF
fi
HOOK_EOF

chmod +x "$HOOKS_DIR"/*.sh

echo -e "  ${GREEN}+ session-context.sh${NC}"
echo -e "  ${GREEN}+ sofia-stop-gate.sh${NC}"
echo -e "  ${GREEN}+ deby-stop-dictamen.sh${NC}"
echo ""
echo -e "${GREEN}✓ 3 hooks instalados en $HOOKS_DIR${NC}"
echo -e "${YELLOW}Los hooks se activarán en la próxima sesión de VS Code Remote.${NC}"
