# Checkpoint: IMPL-20260313-01 — Catálogo Clínico y Perfiles B2B

- **Fecha:** 2026-03-13
- **Agente:** SOFIA - Builder
- **ID de Intervención:** `IMPL-20260313-01`
- **SPEC de Referencia:** `context/SPECs/ARCH-20260313-01-CATALOGO-ESTUDIOS-PERFILES.md`
- **Estado:** ✅ Listo para migración

---

## 1. Resumen de Cambios

Modificado únicamente `frontend/prisma/schema.prisma` con la totalidad de las entidades especificadas en `ARCH-20260313-01`. No se modificó ningún archivo de lógica de aplicación — solo el modelo de datos.

## 2. Entidades Nuevas Agregadas

### Enums
| Enum | Valores |
|------|---------|
| `GenderRestriction` | `ALL`, `MALE`, `FEMALE` |
| `EventTestStatus` | `PENDING`, `COMPLETED`, `SKIPPED`, `CANCELLED` |

### Modelos
| Modelo | Tabla | Descripción |
|--------|-------|-------------|
| `TestCategory` | `test_categories` | Categorías del catálogo (Laboratorio, Imagen, etc.) |
| `MedicalTest` | `medical_tests` | Prueba médica con opciones dinámicas y restricción de género |
| `MedicalProfile` | `medical_profiles` | Perfil/combo de pruebas; puede ser exclusivo a una empresa |
| `ProfileTest` | `profile_tests` | Tabla pivote explícita MedicalProfile ↔ MedicalTest (`@@unique([profileId, testId])`) |
| `EventTest` | `event_tests` | Instancia transaccional de una prueba en un evento; incluye `testNameSnapshot` inmutable |

## 3. Entidades Modificadas

### `MedicalEvent`
- **Agregado** `billingCompanyId String?` — empresa a quien se factura (reseller B2B, ej. Sodexo)
- **Agregado** `billingCompany Company? @relation("BillingCompany", ...)` — con relación nombrada para no colisionar con otras relaciones de `Company`
- **Agregado** `eventTests EventTest[]` — back-relation hacia las pruebas instanciadas
- **Mantenidas** todas las relaciones existentes (`worker`, `branch`, `appointment`, `verdict`, etc.)

### `Company`
- **Agregado** `medicalProfiles MedicalProfile[]` — perfiles exclusivos de esta empresa
- **Agregado** `billedEvents MedicalEvent[] @relation("BillingCompany")` — back-relation nombrada

### `User`
- **Agregado** `performedTests EventTest[]` — pruebas realizadas/validadas por este usuario

## 4. Decisiones de Diseño

| Decisión | Justificación |
|----------|---------------|
| `Service` / `ServiceProfile` se mantienen intactos | La SPEC indica "no romper relaciones existentes que usa Vercel". La migración/depreciación es tarea futura. |
| `ProfileTest` como tabla pivote explícita | Permite agregar campos en el futuro (ej. orden, precio override) sin crear una nueva migración disruptiva. |
| `testId` en `EventTest` es opcional (`String?`) | Si la prueba es eliminada del catálogo, el historial clínico permanece inmutable gracias a `testNameSnapshot`. |
| Relación nombrada `"BillingCompany"` | Evita ambigüedad en Prisma al tener dos relaciones desde `MedicalEvent` hacia `Company`. |

## 5. Validación — Soft Gates

| Gate | Estado | Evidencia |
|------|--------|-----------|
| Gate 1 — Compilación | ✅ | `npx prisma format` → "Formatted prisma/schema.prisma in 42ms 🚀" sin errores |
| Gate 2 — Testing | ⏳ | Tests de migración pendientes (requieren BD real). Bloqueados hasta siguiente sesión. |
| Gate 3 — Revisión | ✅ | `qodo self-review` ejecutado. Schema revisado manualmente contra SPEC. |
| Gate 4 — Documentación | ✅ | Este checkpoint y marcas de agua en el schema. |

## 6. Próximo Paso Recomendado

Ejecutar la migración en ambiente de desarrollo:
```bash
cd frontend
pnpm exec prisma migrate dev --name init_clinical_tests_profiles
```
> **Precaución:** Esta migración agrega tablas nuevas y columnas opcionales — no debería afectar datos existentes, pero se recomienda hacer backup de BD antes de ejecutar en staging.
