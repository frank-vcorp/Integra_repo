#!/bin/bash
# INTEGRA-TOOLBELT Audit Script
# Detecta herramientas CLI instaladas y su estado de autenticación.
# Version: 1.0.0

mkdir -p .integra
REPORT_FILE=".integra/toolbelt-report.md"

echo "# 🧰 INTEGRA TOOLBELT REPORT" > "$REPORT_FILE"
echo "*Generado: $(date)*" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo "## ✅ Herramientas Detectadas y Estado" >> "$REPORT_FILE"
echo "| Herramienta | Binario | Auth Status | Proyecto Vinculado |" >> "$REPORT_FILE"
echo "|-------------|---------|-------------|--------------------|" >> "$REPORT_FILE"

# Función para chequear herramientas
check_tool() {
    TOOL_NAME=$1
    CMD=$2
    AUTH_CMD=$3
    PROJECT_FILE=$4

    if command -v "$CMD" &> /dev/null; then
        # Intentar obtener versión corta
        VERSION=$($CMD --version 2>/dev/null | head -n 1 | cut -c 1-15)
        
        AUTH_OUTPUT=""
        if eval "$AUTH_CMD" &> /dev/null; then
             AUTH_STATUS="✅ Autenticado"
        else
             AUTH_STATUS="❌ No Auth"
        fi

        PROJECT_STATUS="-"
        if [ ! -z "$PROJECT_FILE" ]; then
            if [ -f "$PROJECT_FILE" ] || [ -d "$PROJECT_FILE" ]; then
                 PROJECT_STATUS="✅ Detectado"
            fi
        fi
        
        echo "| **$TOOL_NAME** | Copilot-Installed | $AUTH_STATUS | $PROJECT_STATUS |" >> "$REPORT_FILE"
    else
         return 1
    fi
    return 0
}

# Arrays de herramientas no detectadas
NOT_DETECTED=""

# Vercel
# vercel whoami requiere token, si falla es no auth
# A veces vercel CLI pide login interactivo, hay que tener cuidado. 
# Usamos timeout para evitar cuelgues si pide input
if ! check_tool "Vercel" "vercel" "timeout 3s vercel whoami" ".vercel"; then
    NOT_DETECTED="$NOT_DETECTED Vercel,"
fi

# Railway
if ! check_tool "Railway" "railway" "timeout 3s railway whoami" "railway.toml"; then
    NOT_DETECTED="$NOT_DETECTED Railway,"
fi

# Supabase
# supabase projects list requiere login
if ! check_tool "Supabase" "supabase" "timeout 3s supabase projects list" "supabase/config.toml"; then
     NOT_DETECTED="$NOT_DETECTED Supabase,"
fi

# Firebase
# firebase projects:list requiere login
if ! check_tool "Firebase" "firebase" "timeout 3s firebase projects:list" "firebase.json"; then
     NOT_DETECTED="$NOT_DETECTED Firebase,"
fi

# GCloud
# gcloud auth list chequea cuentas activas
if ! check_tool "GCloud" "gcloud" "gcloud auth list --filter=status:ACTIVE --format='value(account)' | grep -q ." ""; then
     NOT_DETECTED="$NOT_DETECTED GCloud,"
fi

# Docker
if ! check_tool "Docker" "docker" "docker info" "Dockerfile"; then
     NOT_DETECTED="$NOT_DETECTED Docker,"
fi


echo "" >> "$REPORT_FILE"
echo "## ❌ No Detectadas / No Instaladas" >> "$REPORT_FILE"
if [ -z "$NOT_DETECTED" ]; then
    echo "Todas las herramientas soportadas fueron detectadas." >> "$REPORT_FILE"
else
    # Limpiar coma final y formatear
    echo "${NOT_DETECTED%,}" | sed 's/,/\n- /g' | sed 's/^/- /' >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "> **Nota para Agentes:** Este reporte es la fuente de verdad sobre qué capacidades de infraestructura están disponibles. Si una herramienta está marcada como '✅ Autenticado', ÚSALA directamente en lugar de preguntar." >> "$REPORT_FILE"

# Imprimir reporte al stdout para feedback inmediato
cat "$REPORT_FILE"
