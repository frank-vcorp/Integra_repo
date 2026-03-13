import re

with open("PROYECTO.md", "r") as f:
    content = f.read()

# Update Estado and ID Actual
content = re.sub(r'\*\*Estado:\*\* .*', '**Estado:** [~] EN PROGRESO: Catálogo Clínico y Perfiles B2B', content)
content = re.sub(r'\*\*ID Actual:\*\* .*', '**ID Actual:** ARCH-20260313-01 (Refactor de Estudios Clínicos)', content)

# Add new log entry
new_log = "- **2026-03-13 (INTEGRA/DEBY):** [~] **Planificación: Arquitectura de Catálogo Clínico y Perfiles (B2B).** Se definió la estructura de base de datos para soportar pruebas dinámicas con metadatos (JSON `options`), perfiles jerárquicos multitenant (modelo Sodexo) y preservación inmutable del historial clínico a través del `EventTest`. Handoff enviado a `@SOFIA` para refactorizar `schema.prisma`. (ARCH-20260313-01)\n"

# add to top of Diario de Cambios (after the header)
content = content.replace("## 📅 Diario de Cambios\n", f"## 📅 Diario de Cambios\n{new_log}")

with open("PROYECTO.md", "w") as f:
    f.write(content)
