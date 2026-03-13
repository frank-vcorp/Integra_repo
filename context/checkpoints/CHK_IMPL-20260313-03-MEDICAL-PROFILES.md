# Checkpoint de Entrega: IMPL-20260313-03

**Fecha:** 2026-03-13  
**ID:** IMPL-20260313-03  
**Agente:** SOFIA  
**Sprint:** Catálogos Clínicos y Perfiles B2B (ARCH-20260313-01)

---

## Resumen Ejecutivo

Implementación del armador de paquetes/combos médicos (`MedicalProfile`).  
CRUD completo con validación Zod server-side, UI administrativa con checkboxes agrupados por categoría y soporte para el modelo Sodexo (asignación de perfil a empresa cliente).

---

## Archivos Creados / Modificados

| Archivo | Tipo | Operación |
|---------|------|-----------|
| `frontend/src/actions/medical-profiles.ts` | Server Actions | ✅ Creado |
| `frontend/src/app/admin/medical-profiles/page.tsx` | Server Component | ✅ Creado |
| `frontend/src/app/admin/medical-profiles/MedicalProfilesClient.tsx` | Client Component | ✅ Creado |
| `frontend/src/app/layout.tsx` | Layout global | ✅ Modificado (NavItem) |

---

## Detalle de Implementación

### 1. Server Actions (`medical-profiles.ts`)

- **Zod Schema:** `MedicalProfileSchema` valida `name`, `companyId` (UUID o null) y `testIds` (array de UUIDs, mínimo 1).
- **`parseTestIds()`:** Helper seguro que parsea JSON de FormData, previene malformación.
- **`getMedicalProfiles()`:** Query con includes de company, tests→test→category y `_count.tests`. Ordenado por nombre.
- **`createMedicalProfile()`:** Crea perfil + tabla pivote `ProfileTest` con nested `create`.
- **`updateMedicalProfile()`:** Reemplaza todas las relaciones `ProfileTest` en una única operación atómica con `deleteMany: {} + create`.
- **`deleteMedicalProfile()`:** Elimina en transacción: primero `profileTest.deleteMany()`, luego `medicalProfile.delete()` (compensando la ausencia de CASCADE en schema).
- Todos los métodos llaman `revalidatePath('/admin/medical-profiles')`.

### 2. Server Component (`page.tsx`)

- Fetch paralelo con `Promise.all()` de: `getMedicalProfiles()`, `getMedicalTests()`, `getCompanies()`.
- Metadata Next.js: `title: 'Perfiles Médicos | AMI Admin'`.
- No tiene `params` dinámicos; no requiere `await params`.

### 3. Client Component (`MedicalProfilesClient.tsx`)

- **Tabla de perfiles:** Muestra nombre, empresa (badge purple / "General"), contador de pruebas y preview de hasta 4 códigos con "+N más".
- **Modal Create/Edit:**
  - Campo `name` (requerido, maxLength 200).
  - `<select>` para `companyId` con opción vacía "General".
  - Buscador en tiempo real de pruebas (filtra por nombre o código).
  - Checkboxes agrupados por `TestCategory`, sticky headers de grupo.
  - Badge contador de pruebas seleccionadas (rojo si = 0, azul si > 0).
  - Botón "Desmarcar todas".
  - Modal scrollable con header/footer fijos (`max-h-[90vh]`, `flex flex-col`).
- **testIds** inyectados en FormData como JSON via `fd.set('testIds', JSON.stringify(...))`.
- **Feedback** con auto-dismiss a los 3.5 segundos.
- **Advertencia** si no hay pruebas en el catálogo (con enlace a `/admin/clinical-catalog`).
- Botón "Nuevo Perfil" deshabilitado si no hay pruebas.

### 4. Layout (`layout.tsx`)

- Agregado `<NavItem href="/admin/medical-profiles" icon="📦" label="Perfiles Médicos" />` bajo "Catálogo Clínico" en la sección "Administración Clínica".

---

## Soft Gates

| Gate | Estado | Evidencia |
|------|--------|-----------|
| ✅ Gate 1: Compilación | PASA | `tsc --noEmit` sin errores. ESLint sin warnings. |
| ⚠️ Gate 2: Testing | PENDIENTE | No hay tests unitarios para las actions (deuda técnica). Funcionalidad verificada por revisión de código. |
| ✅ Gate 3: Revisión | PASA | Código revisado: no hay SQL injection, no hay hardcoded credentials, FormData validado con Zod, JSON parsing seguro. |
| ✅ Gate 4: Documentación | PASA | JSDoc en todos los archivos con `@id IMPL-20260313-03`. |

---

## Decisiones Técnicas

1. **`deleteMany: {} + create` vs `$transaction`:** Se usó nested write de Prisma para el UPDATE ya que es más atómico y limpio. Para DELETE se usó `$transaction` porque no hay CASCADE en schema.
2. **JSON para testIds:** FormData no soporta arrays natiamente. Se serializa/deserializa JSON en campo `hidden`. No se usaron múltiples inputs `testIds[]` para evitar complejidad en el server action.
3. **Buscador client-side:** Filtro en tiempo real via `useMemo` — no requiere roundtrip al servidor para UX fluida.
4. **Separación Server/Client:** Page Server Component hace el fetch, MedicalProfilesClient es `'use client'`. Sigue el patrón establecido por `ClinicalCatalogClient`.

---

## Deuda Técnica Registrada

| DT | Descripción | Impacto |
|----|-------------|---------|
| DT-006 | Tests unitarios para `createMedicalProfile`, `updateMedicalProfile`, `deleteMedicalProfile` | Medio |
| DT-007 | Agregar `onDelete: Cascade` a `ProfileTest.profile` en schema para simplificar la lógica de eliminación | Bajo |

---

## Próximo Paso Sugerido (INTREGA)

- Integrar `MedicalProfile` en el flujo de `MedicalEvent` (selector de perfil al crear evento).
- Conectar `EventTest` con `ProfileTest` al instanciar un evento a partir de un perfil.
