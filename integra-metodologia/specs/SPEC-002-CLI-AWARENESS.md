# SPEC-002: INTEGRA-CLI-AWARENESS (Introspección de Herramientas)

| Metadatos | Detalle |
|-----------|---------|
| **ID** | ARCH-20260312-01 |
| **Estado** | Draft |
| **Autor** | INTEGRA (Arquitecto) |
| **Fecha** | 2026-03-12 |
| **Contexto** | Eliminación de "Context Switching" y "Amnesia de Herramientas" |

## 1. Contexto y Problema
Actualmente, los agentes (GEMINI, DEBY, SOFIA) operan como "silos" dentro de VS Code. Aunque el entorno del usuario tiene instalados CLIs potentes (Vercel, Docker, Supabase, Railway), los agentes "olvidan" que pueden usarlos.

Esto obliga al usuario a:
1.  Salir del flujo del agente.
2.  Abrir una terminal.
3.  Ejecutar comandos manuales (ej: `vercel logs`).
4.  Copiar el output y pegarlo de vuelta al agente.

El objetivo es dotar a la metodología INTEGRA de un sistema de **Detección, Persistencia y Abstracción** de herramientas de línea de comandos.

## 2. Arquitectura de la Solución

### 2.1. El concepto "Toolbelt Awareness"
El agente no debe adivinar; debe "inventariar" el entorno al inicio.

Se definen tres niveles de consciencia:
1.  **Nivel Binario:** ¿Está instalado el CLI? (ej: `command -v vercel`)
2.  **Nivel Auth:** ¿Está autenticado? (ej: `vercel whoami`)
3.  **Nivel Contexto:** ¿Este proyecto usa esta herramienta? (ej: existe `vercel.json` o `.vercel/`)

### 2.2. Mapa de Herramientas Soportadas (Fase 1)

| Herramienta | Binario | Check Auth | Comando Logs | Comando Status | Check Proyecto |
|-------------|---------|------------|--------------|----------------|----------------|
| **Vercel** | `vercel` | `vercel whoami` | `vercel logs` | `vercel inspect` | `vercel.json`, `.vercel` |
| **Railway** | `railway` | `railway status` | `railway logs` | `railway status` | `railway.toml` |
| **Supabase** | `supabase` | `supabase projects list` | `supabase db remote commit` | `supabase status` | `supabase/config.toml` |
| **Docker** | `docker` | `docker info` | `docker logs [id]` | `docker ps` | `docker-compose.yml`, `Dockerfile` |
| **Firebase** | `firebase` | `firebase login:list` | `firebase functions:log` | `firebase deploy --dry-run` | `firebase.json` |
| **Git** | `git` | `git config user.name` | `git log` | `git status` | `.git` |

## 3. Implementación Técnica

### 3.1. Fase de Detección (Integración en `generar-discovery`)
Se modificará el Skill `generar-discovery` para incluir un paso de **"Auditoría de Herramientas"**.

**Script Lógico (Pseudo-código):**
```bash
# 1. Detectar binarios
TOOLS_FOUND=[]
for tool in vercel railway supabase docker firebase; do
  if command -v $tool > /dev/null; then
    # 2. Check Auth (Fail fast)
    if $tool whoami (o equivalente); then
      TOOLS_FOUND.push($tool)
    else
      echo "⚠️ $tool instalado pero NO autenticado. Ejecuta '$tool login'."
    fi
  fi
done

# 3. Guardar en Memoria
# Guardar en /memories/repo/tools.json
```

### 3.2. Abstracción de Operaciones (Wrapper Skills)
No crearemos un script monolítico, sino **Skills de Agente** que sepan qué comando ejecutar según el archivo de configuración detectado.

#### Skill: `ver-logs`
*Input:* Entorno (producción/preview), Servicio (opcional).
*Lógica:*
- Si hay `vercel.json` → Ejecutar `vercel logs [url-deployment]`.
- Si hay `railway.toml` → Ejecutar `railway logs`.
- Si hay `docker-compose.yml` → Ejecutar `docker-compose logs --tail=100`.
- Fallback: Pedir al usuario que ejecute el comando manual.

#### Skill: `check-deploy-status`
*Input:* N/A
*Lógica:*
- Vercel: `vercel inspect [deployment-url]`
- Railway: `railway status`
- GitHub Actions: `gh run list --limit 1` (si `gh` CLI existe).

#### Skill: `db-shell`
*Input:* Query (opcional)
*Lógica:*
- Supabase: `supabase db query "[query]"` (si es local) o instrucción de conexión remota.
- Docker: `docker exec -it [db-container] psql ...`

## 4. Persistencia en Memoria

Para evitar ejecutar `whoami` en cada turno, los agentes guardarán el estado en una memoria de repositorio.

**Archivo:** `/memories/repo/cli-capabilities.json`

```json
{
  "last_check": "2026-03-12T10:00:00Z",
  "tools": {
    "vercel": {
      "installed": true,
      "authenticated": true,
      "project_linked": true,
      "user": "frank-user"
    },
    "railway": {
      "installed": true,
      "authenticated": false,
      "project_linked": false
    },
    "docker": {
      "installed": true,
      "running": true
    }
  }
}
```

## 5. Integración con Agentes

### GEMINI (Infraestructura)
- **Rol:** Guardián de los CLIs.
- **Acción:** Antes de un deploy, verificará `cli-capabilities.json`. Si el token expiró, su primer paso es solicitar: "Por favor, ejecuta `vercel login` antes de continuar".
- **Uso:** Automatizar `check-deploy-status` para validar Soft Gates de "Deployment exitoso".

### DEBY (Debugging)
- **Rol:** Analista Forense.
- **Uso:** Cuando el usuario diga "La web está caída", DEBY invocará `ver-logs` automáticamente usando el CLI detectado, sin preguntar "¿Qué hosting usas?".
- **Beneficio:** Obtiene el stack trace real directamente de la fuente.

## 6. Seguridad
- **Cero Tokens en Logs:** Los agentes NUNCA deben imprimir tokens de sesión en el chat ni guardarlos en archivos markdown.
- **Uso de Auth Existente:** Los agentes usan la sesión ya iniciada en la terminal del usuario. No intentan loguearse con credenciales pasadas por chat.
- **Fail Fast:** Si el comando devuelve `401 Unauthorized`, el agente se detiene inmediatamente y solicita intervención humana.

## 7. Próximos Pasos (Roadmap)
1.  Actualizar Skill `generar-discovery` para incluir el script de detección.
2.  Crear Skill `consultar-logs-infra` (o `ver-logs`) en la carpeta de skills globales.
3.  Instruir a DEBY y GEMINI en sus archivos `.agent.md` para buscar primero en CLIs antes de preguntar.
