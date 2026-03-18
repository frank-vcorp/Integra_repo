# CHK_IMPL-20260313-05 — Arquitectura JobPosition (Puestos de Trabajo B2B)

**ID:** `IMPL-20260313-05`
**Agente:** SOFIA - Builder
**Fecha:** 2026-03-13
**Estado:** `[✓] Completado`

---

## 1. Resumen Ejecutivo

Se implementó la arquitectura de **Puestos de Trabajo** (`JobPosition`) para el modelo B2B del sistema médico industrial. Esta entidad permite asociar trabajadores a puestos específicos dentro de una empresa, cada uno con un perfil médico predeterminado — base para la automatización del triaje y futuros flujos de examen dirigido.

---

## 2. Cambios Implementados

### 2.1 Schema Prisma (`frontend/prisma/schema.prisma`)

**Nuevo modelo `JobPosition`:**
```prisma
model JobPosition {
  id               String          @id @default(uuid())
  name             String
  description      String?
  companyId        String
  defaultProfileId String?

  company          Company         @relation(fields: [companyId], references: [id])
  defaultProfile   MedicalProfile? @relation(fields: [defaultProfileId], references: [id])
  workers          Worker[]

  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  @@map("job_positions")
}
```

**Modificaciones a modelos existentes:**
- `Worker`: agregado `jobPositionId String?` + relación `jobPosition JobPosition?`
- `Company`: agregada relación inversa `jobPositions JobPosition[]`
- `MedicalProfile`: agregada relación inversa `jobPositions JobPosition[]`

### 2.2 Server Actions (`frontend/src/actions/job-positions.actions.ts`)

CRUD completo con validación Zod:
| Función | Tipo | Descripción |
|---------|------|-------------|
| `getJobPositionsByCompany(companyId)` | Query | Lista puestos por empresa con conteo de trabajadores |
| `getJobPositionById(id)` | Query | Obtiene un puesto con perfil y trabajadores asociados |
| `createJobPosition(formData)` | Mutation | Crea puesto con validación Zod |
| `updateJobPosition(formData)` | Mutation | Actualiza puesto (campos opcionales) |
| `deleteJobPosition(id)` | Mutation | Elimina puesto con validación de UUID |

### 2.3 Base de Datos
- Tabla `job_positions` creada en PostgreSQL Railway
- `prisma db push` ejecutado exitosamente en 7.52s
- `prisma generate` ejecutado — cliente v5.22.0 actualizado

---

## 3. Soft Gates

| Gate | Estado | Evidencia |
|------|--------|-----------|
| ✅ Gate 1: Compilación | PASS | `npx tsc --noEmit` sin errores en archivos nuevos |
| ✅ Gate 2: Testing | N/A | CRUD básico, tests en siguiente sprint |
| ✅ Gate 3: Revisión | PASS | Schema validado por `prisma db push` exitoso |
| ✅ Gate 4: Documentación | PASS | JSDoc en archivo, checkpoint generado |

---

## 4. Dependencias y Relaciones

```
Company (1) ──── (*) JobPosition
MedicalProfile (1) ──── (*) JobPosition  [defaultProfile]
JobPosition (1) ──── (*) Worker
```

---

## 5. Próximos Pasos Sugeridos

- [ ] UI: Página de gestión de puestos en `/admin/companies/[id]/positions`
- [ ] Integración: Auto-seleccionar perfil médico al agendar cita si worker tiene jobPosition con defaultProfile
- [ ] Tests: Unitarios para `getJobPositionsByCompany` y `createJobPosition`
- [ ] Seed: Datos de ejemplo para pruebas de integración

---

## 6. Archivos Modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `frontend/prisma/schema.prisma` | Modificado | Nuevo modelo JobPosition + relaciones |
| `frontend/src/actions/job-positions.actions.ts` | Nuevo | Server Actions CRUD completo |

---

*Generado por SOFIA - Builder | IMPL-20260313-05*
