#!/bin/bash
# =============================================================================
# INTEGRA Hook: SessionStart — Inyecta contexto del proyecto al inicio
# =============================================================================
# Se ejecuta al iniciar sesión con CUALQUIER agente INTEGRA.
# Detecta: PROYECTO.md, interconsultas pendientes, rama actual, entorno.
# Devuelve JSON con additionalContext para el modelo.
# =============================================================================

CONTEXT_PARTS=()

# 1. Rama actual
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "desconocida")
    CONTEXT_PARTS+=("Rama actual: $BRANCH")
fi

# 2. Detectar PROYECTO.md y extraer sprint activo
if [ -f "PROYECTO.md" ]; then
    CONTEXT_PARTS+=("PROYECTO.md detectado — consultar para estado del backlog.")
    # Extraer tareas en progreso
    IN_PROGRESS=$(grep -c '\[/\]' PROYECTO.md 2>/dev/null || echo "0")
    BLOCKED=$(grep -c '\[!\]' PROYECTO.md 2>/dev/null || echo "0")
    if [ "$IN_PROGRESS" -gt 0 ]; then
        CONTEXT_PARTS+=("Tareas en progreso: $IN_PROGRESS")
    fi
    if [ "$BLOCKED" -gt 0 ]; then
        CONTEXT_PARTS+=("ALERTA: $BLOCKED tareas bloqueadas.")
    fi
else
    CONTEXT_PARTS+=("No se detectó PROYECTO.md — considerar ejecutar Discovery si es proyecto nuevo.")
fi

# 3. Interconsultas pendientes
if [ -d "context/interconsultas" ]; then
    PENDING=$(find context/interconsultas -name "*.md" -newer context/checkpoints 2>/dev/null | wc -l | tr -d ' ')
    if [ "$PENDING" -gt 0 ]; then
        CONTEXT_PARTS+=("Hay $PENDING interconsulta(s) reciente(s) en context/interconsultas/ — revisar antes de actuar.")
    fi
fi

# 4. Último checkpoint
if [ -d "context/checkpoints" ]; then
    LAST_CHK=$(ls -t context/checkpoints/CHK_*.md 2>/dev/null | head -1)
    if [ -n "$LAST_CHK" ]; then
        CONTEXT_PARTS+=("Último checkpoint: $(basename "$LAST_CHK")")
    fi
fi

# 5. Detectar stack (package.json, composer.json, etc.)
if [ -f "package.json" ]; then
    CONTEXT_PARTS+=("Stack detectado: Node.js (package.json presente)")
elif [ -f "composer.json" ]; then
    CONTEXT_PARTS+=("Stack detectado: PHP/Composer (composer.json presente)")
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    CONTEXT_PARTS+=("Stack detectado: Python")
fi

# Construir salida JSON
JOINED=$(printf '%s. ' "${CONTEXT_PARTS[@]}")
# Escapar comillas dobles para JSON
JOINED=$(echo "$JOINED" | sed 's/"/\\"/g')

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "[INTEGRA SessionStart] $JOINED"
  }
}
EOF
