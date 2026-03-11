# 🧬 Metodología INTEGRA v3.1.0

Sistema de gobernanza para proyectos de desarrollo con agentes IA especializados.

> **📖 Documento completo:** [METODOLOGIA-INTEGRA.md](METODOLOGIA-INTEGRA.md)

## ✨ Lo Nuevo en v3.1.0

### 🤖 Auditoría Externa Automatizada
Integración de bots revisores de código en cada PR:

| Bot | Función | Config |
|-----|---------|--------|
| **CodeRabbit** | Revisión asertiva: código muerto, DRY, complejidad | `.coderabbit.yaml` |
| **Qodo Merge** | Documentación de PR, tests, sugerencias | `.qodo.toml` |

**Flujo:** SOFIA (abre PR) → Bots (analizan) → GEMINI (valida feedback) → SOFIA (refactoriza si aplica)

---

## ✨ Lo Nuevo en v3.0.0

### Unificación VS Code + Antigravity (Opcional)
- 20 secciones formales
- 5 agentes especializados
- Paradigma de hibridación (Antigravity es opcional)

---

## ✨ Lo Nuevo en v2.4.0

### 📝 Control de Versiones (Git)
Guía completa de cuándo hacer commit y push:

| Evento | Acción |
|--------|--------|
| Tarea completada | Commit + Push |
| Antes de cambio riesgoso | Commit `[WIP]` |
| Fin de Micro-Sprint | Commit + Push |
| Código que no compila | ❌ NUNCA push |

**Conventional Commits:** `feat(scope): mensaje`

---

## ✨ Lo Nuevo en v2.3.0

### 🛑 Escalamiento Obligatorio al Humano
Los agentes DEBEN detenerse y preguntar cuando:
- **Mismo error 2 veces** → "¿Otro enfoque o lo revisas tú?"
- **3 intentos fallidos** → "Necesito tu input"
- **Cambio afecta >5 archivos** → "¿Confirmas?"

**Regla del "No Adivinar":** Si no estoy 80% seguro, pregunto.

### 🔍 Discovery de Proyecto Nuevo
Protocolo de onboarding cuando INTEGRA entra a un proyecto desconocido:
1. Escanear estructura
2. Identificar stack tecnológico
3. Generar `context/00_ARQUITECTURA.md`
4. Preguntar al humano contexto de negocio

---

## ✨ Lo Nuevo en v2.2.0

### Sistema de Micro-Sprints
Trabajo por sesiones con **entregables demostrables**:

> 🎯 **Regla de Oro:** "Si no lo puedo ver funcionando, no está terminado."

- **Rituales de sesión** - Inicio y cierre estructurados
- **Entregables tangibles** - Funcionalidad que el usuario puede VER
- **Budget Points** - Sistema de estimación por puntos (1-5)
- **Multi-proyecto** - Distribuye micro-sprints entre proyectos

Ver sección completa en [METODOLOGIA-INTEGRA.md#11-sistema-de-micro-sprints](METODOLOGIA-INTEGRA.md#11-sistema-de-micro-sprints)

---

## 🚀 Quick Start

### Opción 1: Copiar a tu proyecto
```bash
cp -r integra-metodologia/* /ruta/a/tu/proyecto/
```

### Opción 2: Usar script de inicialización
```bash
./scripts/init-proyecto.sh /ruta/a/tu/proyecto "NombreProyecto"
```

### Opción 3: Manual
1. Copia la carpeta `meta/` a tu proyecto
2. Copia `PROYECTO.md` y `AGENTS.md` a la raíz
3. Crea la carpeta `context/` con las subcarpetas
4. Instala los prompts en VS Code (ver sección Prompts)

---

## 📁 Estructura del Paquete

```
integra-metodologia/
├── README.md                    # Este archivo
├── AGENTS.md                    # Documentación del ecosistema de agentes
├── PROYECTO.md                  # Plantilla de backlog y estados
│
├── prompts/                     # Prompts para VS Code Copilot
│   ├── GLOBAL INSTRUCTIONS.instructions.md
│   ├── SOFIA - Builder.agent.md
│   ├── INTEGRA - Arquitecto.agent.md
│   ├── GEMINI-CLOUD-QA.agent.md
│   ├── CRONISTA-Estados-Notas.agent.md
│   └── Deby.agent.md
│
├── meta/                        # Estándares y plantillas
│   ├── SPEC-CODIGO.md          # Convenciones de código
│   ├── criterios_calidad.md    # Checklist de calidad
│   ├── plantilla_control.md    # Formato de Checkpoints
│   ├── plantilla_SPEC.md       # Formato de especificaciones
│   └── plantillas/
│       ├── HANDOFF_FEATURE.md  # Plantilla de handoff
│       ├── DICTAMEN.md         # Plantilla de dictamen forense
│       ├── ADR.md              # Plantilla de decisión arquitectónica
│       ├── RETRO.md            # Plantilla de retrospectiva
│       └── MICRO-SPRINT.md     # Plantilla de micro-sprint
│
├── context/                     # Contexto del proyecto
│   ├── dossier_tecnico.md      # Bitácora técnica
│   ├── 00_ARQUITECTURA.md      # Propuesta arquitectónica
│   ├── decisions/              # ADRs
│   └── interconsultas/         # Dictámenes de Deby
│
├── Checkpoints/                 # Puntos de control
│
└── scripts/
    └── init-proyecto.sh        # Script de inicialización
```

---

## 🤖 Ecosistema de Agentes

| Agente | Rol | Modelo Recomendado |
|--------|-----|-------------------|
| **INTEGRA - Arquitecto** | Product Owner / Arquitecto | Gemini 3 Pro |
| **SOFIA - Builder** | Implementación de código | Claude Haiku 4.5 |
| **GEMINI-CLOUD-QA** | QA / Infraestructura | Gemini 3 Pro |
| **Deby** | Lead Debugger (Forense) | Claude Opus 4.5 |
| **CRONISTA** | Administrador de Estados | GPT-5.1 |

### Flujo de Interconsultas
```
       ┌──────────┐
 ┌────►│  DEBY    │◄────┐  (Solo recibe)
 │     │(Forense) │     │
 │     └──────────┘     │
 │                      │
┌┴─────────────┐  ┌─────┴────────┐
│   INTEGRA    │◄►│    SOFIA     │  (Bidireccional)
│ (Arquitecto) │  │  (Builder)   │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │  ┌──────────┐   │
       └─►│  GEMINI  │◄──┘
          │(QA/Infra)│
          └────┬─────┘
               │
          ┌────▼─────┐
          │ CRONISTA │
          └──────────┘
```

---

## 🔧 Instalación de Prompts en VS Code

1. Abre VS Code
2. `Ctrl+Shift+P` → "Preferences: Open User Prompts Folder"
3. Copia todos los archivos de `prompts/` a esa carpeta
4. Reinicia VS Code

---

## 📋 Flujo de Estados

```
[ ] Pendiente → [/] En Progreso → [✓] Completado → [X] Aprobado (por humano)
```

### Soft Gates (antes de marcar [✓])
1. ✅ Compilación sin errores
2. ✅ Tests pasando
3. ✅ Revisión de código/QA
4. ✅ Documentación actualizada

---

## 🆔 Prefijos de ID

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `ARCH` | Decisiones arquitectónicas | `ARCH-20260126-01` |
| `IMPL` | Implementaciones | `IMPL-20260126-01` |
| `FIX` | Debugging/Fixes | `FIX-20260126-01` |
| `INFRA` | Infraestructura | `INFRA-20260126-01` |
| `DOC` | Documentación | `DOC-20260126-01` |

---

## 📚 Documentación Adicional

- [SPEC-CODIGO.md](meta/SPEC-CODIGO.md) - Convenciones de código
- [criterios_calidad.md](meta/criterios_calidad.md) - Checklist de calidad
- [AGENTS.md](AGENTS.md) - Guía completa de agentes

---

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

---

**Autor:** Frank Saavedra  
**Versión:** 2.1.1  
**Última actualización:** 2026-01-26
