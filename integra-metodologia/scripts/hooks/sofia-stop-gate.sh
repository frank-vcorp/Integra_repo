#!/bin/bash
# =============================================================================
# INTEGRA Hook: Stop (SOFIA) — Valida Soft Gates antes de cerrar sesión
# =============================================================================
# Se ejecuta cuando SOFIA intenta terminar su sesión.
# Primera vez: bloquea y recuerda validar Soft Gates.
# Segunda vez (stop_hook_active=true): permite cerrar (evita loop infinito).
# =============================================================================

# Leer stdin para obtener stop_hook_active
INPUT=$(cat)
STOP_ACTIVE=$(echo "$INPUT" | grep -o '"stop_hook_active"[[:space:]]*:[[:space:]]*true' || true)

if [ -n "$STOP_ACTIVE" ]; then
    # Segunda invocación — dejar que termine para evitar loop infinito
    cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "Stop"
  }
}
EOF
    exit 0
fi

# Primera invocación — recordar Soft Gates
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "decision": "block",
    "reason": "[INTEGRA Soft Gates] Antes de finalizar, verifica los 4 Gates: (1) ¿Compila sin errores? (2) ¿Tests pasan? (3) ¿Ejecutaste qodo self-review? (4) ¿Generaste checkpoint en context/checkpoints/? Si ya los validaste, puedes finalizar."
  }
}
EOF
