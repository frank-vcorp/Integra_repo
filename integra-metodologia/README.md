# 🧬 Metodología INTEGRA v3.1.0

**INTEGRA** (Inteligencia Técnica y Gobernanza para Resultados Ágiles) es una metodología de desarrollo de software diseñada para equipos híbridos humano-IA. Define cómo múltiples agentes de IA especializados colaboran entre sí y con un director humano para entregar software de alta calidad con trazabilidad completa.

> "Cada decisión documentada, cada cambio trazable, cada agente responsable."

**Autor:** Frank Saavedra

---

## Principios Fundamentales

### Trazabilidad Total
- Cada intervención tiene un **ID único** (`ARCH-YYYYMMDD-NN`, `IMPL-...`, `FIX-...`, `INFRA-...`, `DOC-...`)
- Cada archivo modificado tiene una **marca de agua** JSDoc
- Cada decisión queda documentada en un **artefacto**

### Fuente de Verdad Única
`PROYECTO.md` es el documento central que refleja el estado real del proyecto.

### Soft Gates de Calidad
Ninguna tarea se marca como completada sin pasar 4 validaciones:
1. Compilación sin errores
2. Tests pasando
3. Revisión de código/QA
4. Documentación actualizada

### Principio del Cañón y la Mosca
> "Usa la herramienta más simple que resuelva el problema eficientemente."

### Especialización con Colaboración
Cada agente tiene un rol específico pero pueden apoyarse vía interconsultas formales y handoffs estructurados.

---

## 🚀 Quick Start

### Opción 1: Script de inicialización (recomendado)
```bash
./scripts/init-proyecto.sh /ruta/a/tu/proyecto "NombreProyecto"
```
Esto crea: `PROYECTO.md`, `context/`, `Checkpoints/`, `.github/skills/`, `.github/instructions/`, `.github/copilot-instructions.md`, e instala los prompts en VS Code.

### Opción 2: Manual
1. Copia `PROYECTO.md` a la raíz de tu proyecto
2. Crea la carpeta `context/` con subcarpetas `decisions/` e `interconsultas/`
3. Copia `.github/skills/` e `.github/instructions/` a tu proyecto
4. Instala los prompts en VS Code (`Ctrl+Shift+P` → "Open User Prompts Folder")

---

## 📁 Estructura del Paquete

```
integra-metodologia/
├── README.md                    # Este archivo
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
├── context/                     # Contexto del proyecto
│   ├── dossier_tecnico.md      # Bitácora técnica
│   ├── 00_ARQUITECTURA.md      # Propuesta arquitectónica
│   ├── decisions/              # ADRs
│   └── interconsultas/         # Dictámenes de Deby
│
├── Checkpoints/                 # Puntos de control
│
├── scripts/
│   ├── init-proyecto.sh        # Script de inicialización
│   ├── sync-prompts.sh         # Sincronizar prompts LOCAL ↔ REPO
│   └── check-prompts.sh        # Auto-detectar prompts faltantes
│
└── .github/                     # VS Code native (en raíz del proyecto)
    ├── copilot-instructions.md  # Brief del proyecto (se llena con Discovery)
    ├── instructions/
    │   └── SPEC-CODIGO.instructions.md  # Convenciones de código (auto-apply)
    └── skills/                  # 10 Skills activas
        ├── generar-spec/
        ├── generar-adr/
        ├── generar-dictamen/
        ├── generar-discovery/
        ├── generar-micro-sprint/
        ├── generar-checkpoint/
        ├── generar-handoff/
        ├── generar-retro/
        ├── auditar-calidad/
        └── validar-soft-gates/
```

---

## 🤖 Ecosistema de Agentes

| Agente | Rol | Modelo Recomendado |
|--------|-----|-------------------|
| **INTEGRA** | Arquitecto / Product Owner | Gemini 3 Pro |
| **SOFIA** | Builder / Implementadora | Claude Haiku 4.5 |
| **GEMINI** | QA / Infra / Hosting | Gemini 3 Pro |
| **DEBY** | Debugger Forense | Claude Opus 4.5 |
| **CRONISTA** | Administrador de Estados | GPT-5.1 |

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

## 📋 Flujo de Estados

```
[ ] Pendiente → [/] En Progreso → [✓] Completado → [X] Aprobado (por humano)
```

---

## 🔄 Historial de Versiones

| Versión | Fecha | Cambios principales |
|---------|-------|---------------------|
| **v3.1.0** | 2026-03-11 | Auditoría externa (CodeRabbit + Qodo Merge), Antigravity opcional, migración a VS Code Skills/Instructions, `copilot-instructions.md` como infraestructura |
| **v3.0.0** | 2026-02-25 | Unificación VS Code + Antigravity, Micro-Sprints, Checkpoints, Discovery, Deuda Técnica, Git expandido, Rollback, Budget Points |
| **v2.5.1** | 2026-02-03 | Paradigma de Hibridación, Qodo CLI |
| **v2.4.0** | 2026-01-26 | Control de Versiones Git, Conventional Commits |
| **v2.3.0** | 2026-01-26 | Escalamiento al Humano, Regla del "No Adivinar" |
| **v2.2.0** | 2026-01-26 | Sistema de Micro-Sprints (v1) |
| **v2.1.0** | 2026-01-01 | 5 agentes especializados, Soft Gates |
| **v1.0.0** | 2025-10-01 | Versión inicial |

---

## 📄 Licencia

MIT License - Libre para uso personal y comercial.
