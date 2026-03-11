#!/bin/bash
# =============================================================================
# Script de Inicialización de Proyecto con Metodología INTEGRA v3.1.0
# =============================================================================
# Uso: ./init-proyecto.sh /ruta/destino "NombreProyecto"
# =============================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Se requieren 2 argumentos${NC}"
    echo "Uso: $0 /ruta/destino \"NombreProyecto\""
    exit 1
fi

DESTINO="$1"
NOMBRE_PROYECTO="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${GREEN}🧬 Inicializando proyecto con Metodología INTEGRA v3.1.0${NC}"
echo "   Destino: $DESTINO"
echo "   Proyecto: $NOMBRE_PROYECTO"
echo ""

# Crear directorio destino si no existe
mkdir -p "$DESTINO"

# Copiar estructura
echo -e "${YELLOW}📁 Copiando estructura de carpetas...${NC}"
cp -r "$SCRIPT_DIR/context" "$DESTINO/"
cp -r "$SCRIPT_DIR/Checkpoints" "$DESTINO/"
cp "$SCRIPT_DIR/PROYECTO.md" "$DESTINO/"

# Copiar Skills e Instructions de VS Code
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
if [ -d "$REPO_ROOT/.github/skills" ]; then
    mkdir -p "$DESTINO/.github"
    cp -r "$REPO_ROOT/.github/skills" "$DESTINO/.github/"
    echo -e "   ${GREEN}+ Copiados:${NC} .github/skills/ ($(ls -d "$REPO_ROOT/.github/skills/"*/ 2>/dev/null | wc -l) skills)"
fi
if [ -d "$REPO_ROOT/.github/instructions" ]; then
    mkdir -p "$DESTINO/.github"
    cp -r "$REPO_ROOT/.github/instructions" "$DESTINO/.github/"
    echo -e "   ${GREEN}+ Copiados:${NC} .github/instructions/"
fi

# Reemplazar placeholder del nombre del proyecto
echo -e "${YELLOW}📝 Configurando nombre del proyecto...${NC}"
sed -i "s/\[Nombre del Proyecto\]/$NOMBRE_PROYECTO/g" "$DESTINO/PROYECTO.md"
sed -i "s/\[Nombre del Proyecto\]/$NOMBRE_PROYECTO/g" "$DESTINO/context/dossier_tecnico.md"
sed -i "s/\[Nombre del Proyecto\]/$NOMBRE_PROYECTO/g" "$DESTINO/context/00_ARQUITECTURA.md"

# Crear .gitignore si no existe
if [ ! -f "$DESTINO/.gitignore" ]; then
    echo -e "${YELLOW}📄 Creando .gitignore...${NC}"
    cat > "$DESTINO/.gitignore" << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Environment
.env
.env.local
.env.*.local

# Build
.next/
dist/
build/
out/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/

# Misc
*.bak
*.tmp
EOF
fi

# Crear .env.example si no existe
if [ ! -f "$DESTINO/.env.example" ]; then
    echo -e "${YELLOW}📄 Creando .env.example...${NC}"
    cat > "$DESTINO/.env.example" << 'EOF'
# =============================================================================
# Variables de Entorno - [Nombre del Proyecto]
# =============================================================================
# Copia este archivo a .env y completa los valores
# NUNCA commitees .env al repositorio
# =============================================================================

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    sed -i "s/\[Nombre del Proyecto\]/$NOMBRE_PROYECTO/g" "$DESTINO/.env.example"
fi

echo ""
echo -e "${GREEN}✅ Proyecto inicializado exitosamente!${NC}"
echo ""

# Crear .github/copilot-instructions.md
echo -e "${YELLOW}📋 Creando .github/copilot-instructions.md...${NC}"
mkdir -p "$DESTINO/.github"
if [ ! -f "$DESTINO/.github/copilot-instructions.md" ]; then
    cat > "$DESTINO/.github/copilot-instructions.md" << EOF
# Instrucciones de Proyecto: $NOMBRE_PROYECTO

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
EOF
    echo -e "   ${GREEN}+ Creado:${NC} .github/copilot-instructions.md"
else
    echo -e "   ${GREEN}✓ Ya existe${NC} .github/copilot-instructions.md"
fi

# Instalar prompts de agentes en VS Code
echo -e "${YELLOW}🤖 Instalando prompts de agentes en VS Code...${NC}"

# Detectar ruta de prompts según entorno
if [ -n "$CODESPACES" ] || [ -n "$CLOUDENV_ENVIRONMENT_ID" ]; then
    # GitHub Codespaces / Cloud environment
    PROMPTS_DIR="$HOME/.config/Code/User/prompts"
    echo "   Entorno detectado: Codespaces"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    PROMPTS_DIR="$HOME/Library/Application Support/Code/User/prompts"
    echo "   Entorno detectado: macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    PROMPTS_DIR="$HOME/.config/Code/User/prompts"
    echo "   Entorno detectado: Linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash / Cygwin)
    PROMPTS_DIR="$APPDATA/Code/User/prompts"
    echo "   Entorno detectado: Windows"
else
    PROMPTS_DIR=""
    echo -e "${RED}   ⚠ No se pudo detectar el SO. Instala los prompts manualmente.${NC}"
fi

if [ -n "$PROMPTS_DIR" ]; then
    mkdir -p "$PROMPTS_DIR"
    PROMPTS_SRC="$SCRIPT_DIR/prompts"
    if [ -d "$PROMPTS_SRC" ]; then
        UPDATED=0
        INSTALLED=0
        for f in "$PROMPTS_SRC"/*.md; do
            fname=$(basename "$f")
            if [ -f "$PROMPTS_DIR/$fname" ]; then
                if ! diff -q "$f" "$PROMPTS_DIR/$fname" > /dev/null 2>&1; then
                    cp "$f" "$PROMPTS_DIR/$fname"
                    echo -e "   ${YELLOW}↻ Actualizado:${NC} $fname"
                    UPDATED=$((UPDATED + 1))
                fi
            else
                cp "$f" "$PROMPTS_DIR/$fname"
                echo -e "   ${GREEN}+ Instalado:${NC} $fname"
                INSTALLED=$((INSTALLED + 1))
            fi
        done
        if [ $UPDATED -eq 0 ] && [ $INSTALLED -eq 0 ]; then
            echo -e "   ${GREEN}✓ Prompts ya están actualizados${NC}"
        else
            echo -e "   ${GREEN}✓ $INSTALLED instalados, $UPDATED actualizados${NC}"
        fi
    else
        echo -e "${RED}   ⚠ No se encontró carpeta prompts/ en $PROMPTS_SRC${NC}"
    fi
fi

echo ""
echo "Próximos pasos:"
echo "  1. cd $DESTINO"
echo "  2. git init (si es nuevo)"
echo "  3. Edita PROYECTO.md con tus tareas iniciales"
echo "  4. Edita context/dossier_tecnico.md con los detalles de tu stack"
echo ""

# Crear .vscode/tasks.json para auto-check de skills al abrir proyecto
VSCODE_DIR="$DESTINO/.vscode"
TASKS_FILE="$VSCODE_DIR/tasks.json"
if [ ! -f "$TASKS_FILE" ]; then
    mkdir -p "$VSCODE_DIR"
    cat > "$TASKS_FILE" << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "INTEGRA: Verificar prompts y skills",
      "type": "shell",
      "command": "integra-check",
      "options": {
        "env": {
          "PROJECT_DIR": "${workspaceFolder}"
        }
      },
      "presentation": {
        "reveal": "silent",
        "panel": "shared",
        "close": true
      },
      "runOptions": {
        "runOn": "folderOpen"
      },
      "problemMatcher": []
    }
  ]
}
EOF
    echo -e "   ${GREEN}+ Creado:${NC} .vscode/tasks.json (auto-check al abrir)"
fi

echo -e "${GREEN}¡Listo para desarrollar con INTEGRA! 🚀${NC}"
