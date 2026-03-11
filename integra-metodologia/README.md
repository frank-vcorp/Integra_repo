# 🧬 INTEGRA — Sistema Multi-Agente para Desarrollo con IA

**INTEGRA** convierte a tu asistente de IA en un **equipo de 5 agentes especializados** que se comunican entre sí, se reparten el trabajo y no marcan una tarea como terminada sin validarla.

En vez de esto:
```
Tú → "Copilot, hazme esto" → código sin contexto → bugs → frustración
```

Tienes esto:
```
Tú → Arquitecto planifica → Builder construye → QA valida → Debugger interviene si falla → todo queda documentado
```

> Funciona con **VS Code + GitHub Copilot**. Los conceptos son portables a cualquier entorno multi-agente.

**Autor:** Frank Saavedra — [@frank-vcorp](https://github.com/frank-vcorp)

---

## ¿Qué problema resuelve?

La IA genera código rápido, pero sin estructura:
- **No recuerda** lo que hizo hace 3 conversaciones
- **No valida** si lo que generó compila o pasa tests
- **No documenta** por qué tomó una decisión
- **No sabe cuándo detenerse** y preguntarte

INTEGRA soluciona esto con **roles, reglas y trazabilidad**. Cada agente tiene un trabajo, un modelo de IA asignado, y restricciones claras.

---

## Los 5 Agentes

| Agente | Rol | Qué hace | Modelo sugerido |
|--------|-----|----------|-----------------|
| **INTEGRA** | Arquitecto / PO | Planifica, prioriza, decide qué construir | Gemini 3.1 Pro |
| **SOFIA** | Builder | Escribe código, tests, implementa features | Claude Sonnet 4.6 |
| **GEMINI** | QA / Infra | Revisa código, configura hosting, audita | Gemini 2.5 Pro |
| **DEBY** | Debugger Forense | Analiza bugs complejos, genera dictámenes | Claude Opus 4.6 |
| **CRONISTA** | Admin de Estado | Mantiene el backlog actualizado | GPT-4o |

Cada uno tiene su archivo `.agent.md` con personalidad, herramientas permitidas y protocolo de trabajo. No son "prompts sueltos" — son agentes con roles formales.

```
       ┌──────────┐
 ┌────►│  DEBY    │◄────┐  (Solo recibe, nunca escala)
 │     │(Forense) │     │
 │     └──────────┘     │
 │                      │
┌┴─────────────┐  ┌─────┴────────┐
│   INTEGRA    │◄►│    SOFIA     │  (Bidireccional)
│ (Arquitecto) │  │  (Builder)   │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │  ┌──────────┐   │
       └─►│  GEMINI  │◄──┘  (Ambos le piden QA)
          │(QA/Infra)│
          └────┬─────┘
               │
          ┌────▼─────┐
          │ CRONISTA │  (Cualquiera le pide actualizar estado)
          └──────────┘
```

---

## Cómo funciona (en 3 conceptos)

### 1. Soft Gates — Nada se cierra sin validar
Antes de marcar una tarea como "completada", pasa por 4 puertas:

| Gate | Pregunta |
|------|----------|
| Compilación | ¿Compila sin errores? |
| Testing | ¿Los tests pasan? |
| Revisión | ¿Alguien (humano o IA) revisó el código? |
| Documentación | ¿Se actualizó PROYECTO.md y hay marca de agua? |

### 2. Trazabilidad — Todo tiene un ID
Cada intervención genera un ID único: `IMPL-20260311-01`, `FIX-20260311-02`. Esto permite buscar cualquier cambio y encontrar su origen, su dictamen y su checkpoint.

### 3. Escalamiento al Humano — La IA sabe cuándo parar
Si un agente intenta lo mismo 2 veces y falla, se detiene y te pregunta. No inventa soluciones ni borra cosas por su cuenta.

---

## Capas de Defensa (Defense in Depth)

INTEGRA tiene 3 capas de calidad **independientes**:

| Capa | Herramienta | Cuándo actúa | Costo |
|------|-------------|--------------|-------|
| **Interna** | Agentes INTEGRA (Copilot) | Durante el desarrollo | Tu suscripción |
| **Pre-merge** | CodeRabbit + Qodo Merge | En cada Pull Request | $0 (tiers gratuitos) |
| **Manual** | Soft Gates + Qodo CLI | Antes de cerrar tarea | $0 |

Si la IA genera algo cuestionable, CodeRabbit lo atrapa en el PR. Si se le escapa, los Soft Gates lo frenan.

---

## 🚀 Quick Start (VS Code)

### Opción 1: Script automático (recomendado)
```bash
git clone https://github.com/frank-vcorp/Integra_repo.git
cd Integra_repo/integra-metodologia
./scripts/init-proyecto.sh /ruta/a/tu/proyecto "MiProyecto"
```

Esto crea toda la estructura en tu proyecto e instala los agentes en VS Code.

### Opción 2: Manual
1. Copia la carpeta `prompts/` a `~/.config/Code/User/prompts/` (Linux/Mac) o `%APPDATA%\Code\User\prompts\` (Windows)
2. Copia `.github/` a la raíz de tu proyecto (skills + instructions)
3. Copia `PROYECTO.md` a la raíz de tu proyecto
4. Abre VS Code → los agentes aparecen en el chat de Copilot

### Requisitos
- **VS Code** con GitHub Copilot (Pro+ recomendado para agentes custom)
- **GitHub** para PRs con CodeRabbit y Qodo Merge (opcional pero recomendado)
- **Node/npm** o cualquier stack — INTEGRA es agnóstico al lenguaje

---

## ¿Y si no uso VS Code?

Los archivos `.agent.md` son Markdown con frontmatter YAML. La lógica es portable:

- **Los roles y reglas** → funcionan en cualquier orquestador multi-agente (CrewAI, AutoGen, LangGraph, Cursor, etc.)
- **Las plantillas** (SPEC, ADR, Dictamen, Checkpoint) → son texto plano, funcionan en cualquier lado
- **Los Soft Gates** → son una checklist, no dependen de ninguna herramienta
- **El sistema de IDs** → es una convención, funciona con cualquier editor

Lo que tendrías que adaptar: cómo tu entorno carga agentes y activa skills automáticamente. El **diseño del sistema** es el valor, no el formato de los archivos.

---

## 📁 Estructura del Paquete

```
integra-metodologia/
├── README.md                        # Este archivo
├── PROYECTO.md                      # Plantilla: backlog y estados del proyecto
│
├── prompts/                         # Definición de agentes
│   ├── GLOBAL INSTRUCTIONS.instructions.md  # Reglas globales (se cargan siempre)
│   ├── SOFIA - Builder.agent.md
│   ├── INTEGRA - Arquitecto.agent.md
│   ├── GEMINI-CLOUD-QA.agent.md
│   ├── CRONISTA-Estados-Notas.agent.md
│   └── Deby.agent.md
│
├── scripts/
│   ├── init-proyecto.sh             # Inicializa un proyecto con INTEGRA
│   ├── sync-prompts.sh              # Sincroniza prompts local ↔ repo
│   └── check-prompts.sh             # Detecta si faltan prompts instalados
│
└── .github/                         # Se copia a la raíz de cada proyecto
    ├── copilot-instructions.md      # Brief del proyecto (se llena con Discovery)
    ├── instructions/
    │   └── SPEC-CODIGO.instructions.md  # Convenciones de código (auto-apply)
    └── skills/                      # 10 Skills activadas por contexto
        ├── generar-spec/            # Planificar una feature
        ├── generar-adr/             # Documentar decisión de arquitectura
        ├── generar-dictamen/        # Analizar un bug
        ├── generar-discovery/       # Mapear proyecto nuevo
        ├── generar-micro-sprint/    # Planificar sesión de 2-4 horas
        ├── generar-checkpoint/      # Documentar entrega
        ├── generar-handoff/         # Transferir trabajo entre agentes
        ├── generar-retro/           # Retrospectiva de sprint
        ├── auditar-calidad/         # Auditoría end-to-end
        └── validar-soft-gates/      # Validar los 4 gates
```

---

## Flujo típico de trabajo

```
1. Abres VS Code en tu proyecto
2. Invocas a INTEGRA (Arquitecto): "Planificame esta feature"
   → Genera una SPEC con criterios de aceptación
3. Invocas a SOFIA (Builder): "Implementa la SPEC-001"
   → Escribe código, tests, genera checkpoint
4. Haces PR en GitHub
   → CodeRabbit y Qodo Merge revisan automáticamente
5. Invocas a GEMINI (QA): "Valida los Soft Gates"
   → Confirma compilación, tests, revisión, docs
6. CRONISTA actualiza PROYECTO.md
   → Todo queda trazado
```

---

## Principios de diseño

| Principio | Significado |
|-----------|-------------|
| **Trazabilidad total** | Todo tiene ID, marca de agua y artefacto de respaldo |
| **Fuente de verdad única** | `PROYECTO.md` es el estado real del proyecto |
| **Cañón y mosca** | Usa la herramienta más simple que funcione |
| **Escalamiento obligatorio** | Si la IA falla 2 veces, se detiene y pregunta |
| **Especialización colaborativa** | Cada agente tiene su rol, pero se apoyan formalmente |

---

## 🔄 Versiones

| Versión | Fecha | Qué cambió |
|---------|-------|------------|
| **v3.1.0** | 2026-03-11 | Auditoría externa (CodeRabbit + Qodo Merge), Skills/Instructions nativas, `copilot-instructions.md` |
| **v3.0.0** | 2026-02-25 | Micro-Sprints, Checkpoints, Discovery, Deuda Técnica, Rollback |
| **v2.5.1** | 2026-02-03 | Qodo CLI como segunda opinión |
| **v2.1.0** | 2026-01-01 | 5 agentes especializados, Soft Gates |
| **v1.0.0** | 2025-10-01 | Versión inicial |

---

## Preguntas frecuentes

**¿Esto reemplaza saber programar?**
No. INTEGRA organiza cómo la IA te asiste. Tú sigues siendo el director. Los agentes ejecutan, tú decides.

**¿Funciona con proyectos pequeños?**
Para algo que toma <15 minutos, es overkill. INTEGRA brilla en proyectos reales con múltiples archivos, features y sesiones.

**¿Puedo modificar los agentes?**
Sí. Son Markdown. Cambia modelos, ajusta reglas, agrega agentes. Es tu sistema.

**¿Cuánto cuesta?**
INTEGRA es gratis (MIT). Necesitas Copilot (suscripción) y opcionalmente CodeRabbit + Qodo Merge (tiers gratuitos).

---

## 📄 Licencia

MIT — Libre para uso personal y comercial.

---

*Creado por [Frank Saavedra](https://github.com/frank-vcorp) • Metodología en evolución activa*
