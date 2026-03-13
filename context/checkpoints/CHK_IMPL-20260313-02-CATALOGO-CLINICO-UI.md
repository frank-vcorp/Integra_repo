# Checkpoint: IMPL-20260313-02 — Catálogo Clínico: Actions + UI Admin

- **Fecha:** 2026-03-13
- **Agente:** SOFIA - Builder
- **ID de Intervención:** `IMPL-20260313-02`
- **SPEC de Referencia:** `context/SPECs/ARCH-20260313-01-CATALOGO-ESTUDIOS-PERFILES.md`
- **Commit:** `2c1c3dc`
- **Estado:** ✅ Implementado — Listo para QA (GEMINI)

---

## 1. Resumen de Entregables

| Ítem | Archivo | Estado |
|------|---------|--------|
| Migración formal | `prisma/migrations/20260313000000_init_clinical_tests_profiles/migration.sql` | ✅ |
| Server Actions con Zod | `src/actions/clinical-catalog.ts` | ✅ |
| Server Component (página) | `src/app/admin/clinical-catalog/page.tsx` | ✅ |
| Client Component (UI) | `src/app/admin/clinical-catalog/ClinicalCatalogClient.tsx` | ✅ |
| Navegación sidebar | `src/app/layout.tsx` | ✅ |

---

## 2. Decisiones Técnicas

### 2.1. Migración — Estrategia de Baselining
**Situación:** La BD Railway ya tenía todas las tablas (`test_categories`, `medical_tests`, etc.) aplicadas vía `db push` previo. El historial de migraciones local solo tenía `20260203231248_init` sin aplicar.

**Resolución:**
1. `prisma migrate resolve --applied 20260203231248_init` → Baselina el init.
2. Creación manual de `20260313000000_init_clinical_tests_profiles/migration.sql` con SQL idempotente (`IF NOT EXISTS`, `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN NULL; END $$`).
3. `prisma migrate resolve --applied 20260313000000_init_clinical_tests_profiles` → Registra la migración en `_prisma_migrations` sin ejecutarla (ya existe en BD).

**Nota:** Queda drift de migraciones previas (appointments, audit_logs, etc.) fuera del scope ARCH-20260313-01. Documentado como deuda técnica.

### 2.2. Zod v4 — API de Errores
`ZodError.errors` fue renombrado a `ZodError.issues` en Zod v4 (instalado: `^4.3.6`).

### 2.3. Patrón Server Component + Client Component
- `page.tsx` (Server Component): fetching paralelo con `Promise.all([getTestCategories(), getMedicalTests()])`
- `ClinicalCatalogClient.tsx` (Client Component `'use client'`): gestión de estado de modales con `useState` + mutations con `useTransition` para evitar bloqueo de UI.

---

## 3. Server Actions Implementadas (con Zod)

### `TestCategory` CRUD
| Acción | Validación Zod | Manejo de Error |
|--------|---------------|-----------------|
| `getTestCategories()` | N/A | Incluye `_count.tests` |
| `createTestCategory(formData)` | `TestCategorySchema` | Error genérico |
| `updateTestCategory(id, formData)` | `TestCategorySchema` | Error genérico |
| `deleteTestCategory(id)` | Guard: pruebas asociadas > 0 | Error descriptivo con count |

### `MedicalTest` CRUD
| Acción | Validación Zod | Manejo de Error |
|--------|---------------|-----------------|
| `getMedicalTests()` | N/A | Incluye `category` join |
| `createMedicalTest(formData)` | `MedicalTestSchema` | P2002: código duplicado |
| `updateMedicalTest(id, formData)` | `MedicalTestSchema` | P2002: código duplicado |
| `deleteMedicalTest(id)` | N/A | P2003: FK constraint (en uso) |

**Formato campo `options`:** El textarea acepta una opción por línea (`\n`). Las acciones splitean y filtran en server-side antes de guardar como JSON array.

---

## 4. UI Implementada

### Ruta: `/admin/clinical-catalog`
- **Tabs:** 🗂️ Categorías | 🔬 Pruebas Médicas con contadores
- **Categorías:** Tabla con columnas Nombre / Descripción / Nº Pruebas / Acciones. Botón Eliminar deshabilitado si `_count.tests > 0`.
- **Pruebas:** Tabla con columnas Código / Nombre / Categoría / Género / Opciones (preview truncado) / Acciones. Warning visible si no hay categorías.
- **Modales:** Crear y Editar con valores prellenados. `useTransition` para UX no bloqueante. Feedback visual 3.5s (success/error).

---

## 5. Soft Gates

| Gate | Criterio | Estado |
|------|----------|--------|
| ✅ Gate 1: Compilación | `tsc --noEmit` → 0 errores. `pnpm build` → exitoso. `/admin/clinical-catalog` en output. | PASS |
| ⏳ Gate 2: Testing | No hay tests unitarios para las nuevas actions. Pendiente (deuda técnica DT-001). | PENDIENTE |
| ⏳ Gate 3: Revisión | Pendiente revisión de GEMINI / Qodo self-review. | PENDIENTE |
| ⏳ Gate 4: Documentación | Este checkpoint cubre la documentación. | PASS |

---

## 6. Deuda Técnica Registrada

| ID | Descripción | Impacto | Sprint Target |
|----|-------------|---------|---------------|
| DT-001 | Tests unitarios para `src/actions/clinical-catalog.ts` | Bajo-Medio | Sprint siguiente |
| DT-002 | Drift de migraciones: appointments, audit_logs y otros módulos previos no tienen migración formal | Medio (solo afecta historial, no funcionamiento) | Sprint de Infra |

---

## 7. Próximos Pasos Naturales (BLOQUE 3)

1. **MedicalProfile + ProfileTest UI** (`/admin/medical-profiles`): Permitir a Lety crear "baterías" B2B asociando pruebas a empresas.
2. **Asignación de Perfil a MedicalEvent durante Check-in**: En el flujo de Recepción, al hacer check-in con la empresa, auto-asignar las pruebas del perfil corporativo como `EventTest[]`.
3. **Vista de Piso Clínico Enriquecida**: Enfermera ve los `EventTest` de un evento y puede marcar `COMPLETED`/`SKIPPED` con opción dinámica (dropdown de `options`).

---

*Generado por SOFIA — IMPL-20260313-02*
