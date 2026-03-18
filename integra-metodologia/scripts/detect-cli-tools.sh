#!/bin/bash
# detect-cli-tools.sh - INTEGRA Toolbelt Awareness
# Detecta herramientas CLI instaladas, autenticadas y relevantes para el proyecto.

PROJECT_DIR="${1:-$(pwd)}"
OUTPUT_FILE="${2:-.integra/cli-capabilities.json}"

# Cargar credenciales globales de INTEGRA si existen
if [ -f "$HOME/.integra/credentials.env" ]; then
    source "$HOME/.integra/credentials.env"
    echo "🔑 CREDENCIALES CARGADAS: $HOME/.integra/credentials.env (INTEGRA Maestro de Credenciales)" >&2
fi

echo "🔍 Iniciando detección de herramientas CLI en: $PROJECT_DIR" >&2

# Inicializar JSON
echo "{" > "$OUTPUT_FILE"
echo "  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"," >> "$OUTPUT_FILE"
echo "  \"tools\": {" >> "$OUTPUT_FILE"

first=true

check_tool() {
    local name="$1"
    local binary="$2"
    local auth_cmd="$3"
    local project_files="$4" # Separados por espacio
    
    local installed=false
    local authenticated=false
    local relevant=false
    local version=""
    local auth_user=""

    # 1. Check Binary
    if command -v "$binary" &> /dev/null; then
        installed=true
        version=$($binary --version 2>/dev/null | head -n 1 | tr -d '"')
        
        # 2. Check Auth (si está instalado)
        if [ -n "$auth_cmd" ]; then
            if eval "$auth_cmd" &> /dev/null; then
                authenticated=true
                # Intentar capturar usuario (ej: whoami)
                # Esto es genérico, puede fallar para algunos CLIs
                # auth_user=$(eval "$auth_cmd" 2>/dev/null | head -n 1) 
            fi
        else
            authenticated=true # Si no hay comando de auth, asumimos OK (ej: git local)
        fi
    fi

    # 3. Check Project Relevance
    if [ -n "$project_files" ]; then
        for file in $project_files; do
            if [ -e "$PROJECT_DIR/$file" ]; then
                relevant=true
                break
            fi
        done
        # Casos especiales recursivos o ocultos
        if [[ "$project_files" == *".git"* && -d "$PROJECT_DIR/.git" ]]; then relevant=true; fi
        if [[ "$project_files" == *".vercel"* && -d "$PROJECT_DIR/.vercel" ]]; then relevant=true; fi
    else
        relevant=true # Si no se especifican archivos, siempre es relevante si está instalado
    fi

    # Solo reportar si es relevante O está instalado (para uso global)
    # Pero para el toolbelt del proyecto, priorizamos 'relevant' y 'installed'

    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi

    cat <<EOF >> "$OUTPUT_FILE"
    "$name": {
      "binary": "$binary",
      "installed": $installed,
      "authenticated": $authenticated,
      "relevant": $relevant,
      "version": "$version"
    }
EOF
    
    if [ "$relevant" = true ] && [ "$installed" = true ]; then
        echo "✅ Detectado: $name (Auth: $authenticated)" >&2
    elif [ "$relevant" = true ]; then
        echo "⚠️  Relevante pero no instalado: $name" >&2
    fi
}

# --- DEFINICIÓN DE HERRAMIENTAS ---

# Vercel
# Intent ar check con token si existe
VERCEL_CHECK="vercel whoami"
[ -n "$VERCEL_TOKEN" ] && VERCEL_CHECK="vercel whoami --token=$VERCEL_TOKEN"
check_tool "vercel" "vercel" "$VERCEL_CHECK" "vercel.json .vercel package.json"

# Railway
# Intentar usar RAILWAY_TOKEN
RAILWAY_CHECK="railway status"
# Railway usa RAILWAY_TOKEN env var automáticamente si está exportada
check_tool "railway" "railway" "$RAILWAY_CHECK" "railway.toml"

# Supabase
check_tool "supabase" "supabase" "supabase projects list" "supabase/config.toml supabase"

# Firebase
check_tool "firebase" "firebase" "firebase login:list" "firebase.json firesbase.rc"

# Docker
check_tool "docker" "docker" "docker info" "Dockerfile docker-compose.yml docker-compose.yaml"

# GCloud
check_tool "gcloud" "gcloud" "gcloud auth list --filter=status:ACTIVE --format='value(account)'" "app.yaml"

# Git (Básico)
check_tool "git" "git" "git config user.name" ".git"

# Netlify
check_tool "netlify" "netlify" "netlify status" "netlify.toml"

# Fly.io
check_tool "fly" "flyctl" "flyctl auth whoami" "fly.toml"


echo "" >> "$OUTPUT_FILE"
echo "  }" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo "💾 Reporte guardado en: $OUTPUT_FILE" >&2
cat "$OUTPUT_FILE"
