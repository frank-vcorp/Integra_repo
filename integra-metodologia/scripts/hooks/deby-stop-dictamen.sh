#!/bin/bash
# =============================================================================
# INTEGRA Hook: Stop (Deby) — Valida que se generó Dictamen antes de cerrar
# =============================================================================
# Se ejecuta cuando Deby intenta terminar su sesión.
# Primera vez: bloquea y recuerda crear dictamen.
# Segunda vez (stop_hook_active=true): permite cerrar (evita loop infinito).
# =============================================================================

# Leer stdin para obtener stop_hook_active
INPUT=$(cat)
STOP_ACTIVE=$(echo "$INPUT" | grep -o '"stop_hook_active"[[:space:]]*:[[:space:]]*true' || true)

if [ -n "$STOP_ACTIVE" ]; then
    # Segunda invocación — dejar que termine
    cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "Stop"
  }
}
EOF
    exit 0
fi

# Primera invocación — verificar si hay dictamen reciente
DICTAMEN_FOUND=false
if [ -d "context/interconsultas" ]; then
    # Buscar dictámenes creados en los últimos 60 minutos
    RECENT=$(find context/interconsultas -name "DICTAMEN_FIX-*.md" -mmin -60 2>/dev/null | head -1)
    if [ -n "$RECENT" ]; then
        DICTAMEN_FOUND=true
    fi
fi

if [ "$DICTAMEN_FOUND" = true ]; then
    # Dictamen encontrado — permitir cerrar con recordatorio
    cat <<EOF
{
  "systemMessage": "[INTEGRA] Dictamen detectado. Sesión de Deby finalizada correctamente.",
  "hookSpecificOutput": {
    "hookEventName": "Stop"
  }
}
EOF
else
    # Sin dictamen — bloquear primera vez
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
