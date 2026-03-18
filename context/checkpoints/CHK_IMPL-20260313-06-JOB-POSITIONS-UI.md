# CHK_IMPL-20260313-06 — Job Positions UI (Puestos de Trabajo)

**ID de Intervención:** IMPL-20260313-06  
**Agente:** SOFIA - Builder  
**Fecha:** 2026-03-13  
**Estado:** ✅ Entregado — Soft Gates validados  

---

## Resumen de la Entrega

Implementación de la capa visual (Frontend) para la gestión de **Puestos de Trabajo (JobPositions)** por empresa. La UI conecta directamente con los Server Actions del IMPL-20260313-05.

---

## Archivos Creados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `frontend/src/app/companies/[id]/page.tsx` | Server Component | Página de detalle de empresa. Carga en paralelo: empresa, puestos y perfiles. Usa `await params` (Next.js 16+). |
| `frontend/src/app/companies/[id]/JobPositionsPanel.tsx` | Client Component | Panel completo: lista de puestos en tabla, modal de creación y edición, feedback de éxito/error. |

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `frontend/src/actions/company.actions.ts` | Añadido `getCompanyById` (delega a `CompanyService`). |
| `frontend/src/actions/medical-profiles.ts` | Añadida función `getMedicalProfilesForCompany(companyId)` que retorna perfiles de la empresa + perfiles globales (`companyId IS NULL`). |
| `frontend/src/actions/job-positions.actions.ts` | Actualizado `revalidatePath` en `createJobPosition`, `updateJobPosition` y `deleteJobPosition` para invalidar `/companies` y `/companies/${companyId}`. |
| `frontend/src/app/companies/page.tsx` | `CompanyCard` ahora recibe `id` y tiene botón "Puestos de Trabajo" que navega a `/companies/[id]`. |

---

## Funcionalidades Implementadas

- ✅ **Lista de puestos** en tabla con: nombre, descripción, perfil médico asociado (badge), conteo de trabajadores, acciones.
- ✅ **Botón "Crear Puesto"** → abre modal con formulario.
- ✅ **Modal de creación/edición** con campos:
  - `name` (requerido, max 150 chars)
  - `description` (opcional, textarea, max 500 chars)
  - `defaultProfileId` (`<select>` con `<optgroup>`: perfiles de la empresa + perfiles globales)
- ✅ **Eliminar puesto** con `confirm()` nativo.
- ✅ **Estados de carga** con `useTransition` + botones desactivados durante pending.
- ✅ **Feedback visual** (success/error) con auto-dismiss a los 3.5 segundos.
- ✅ **Advertencia** si no hay perfiles médicos disponibles (con link directo a `/admin/medical-profiles`).
- ✅ **Breadcrumb** en la página de detalle para navigation contextual.
- ✅ **Navegación desde lista** — botón "Puestos de Trabajo" en cada tarjeta de empresa.

---

## Soft Gates

| Gate | Estado | Evidencia |
|------|--------|-----------|
| **Gate 1: Compilación** | ✅ Pasa | `npx tsc --noEmit` sin errores en archivos del IMPL. Errores pre-existentes en `admin.actions.ts`, `appointment.actions.ts`, `admin/profiles/page.tsx`, `import-excel.ts` no son del alcance. |
| **Gate 2: Testing** | ⏳ Pendiente QA manual | No existen tests unitarios E2E para esta feature aún. |
| **Gate 3: Revisión** | ✅ Auto-revisado | Patrón coherente con `MedicalProfilesClient.tsx`. Tipos locales definidos. Sin `any`. |
| **Gate 4: Documentación** | ✅ | JSDoc en todos los archivos con `@id IMPL-20260313-06`. |

---

## Decisiones Técnicas

1. **Ruta `/companies/[id]`** (no `/admin/companies/[id]`): las empresas viven en `/companies` en el layout, así que la ruta de detalle sigue el mismo prefijo.
2. **Server Component + `await params`**: cumple regla Next.js 16+ del `AGENTS.md`.
3. **`<optgroup>` en select de perfiles**: divide visualmente "perfiles de la empresa" vs "perfiles globales" sin lógica extra en el backend.
4. **Recarga por `revalidatePath`**: al mutar, se invalidan `/companies` y `/companies/${companyId}` para que el listado y la página de detalle reflejen los cambios sin full reload del cliente.

---

## Próximos Pasos (Recomendados)

- Prueba manual: navegar a `/companies`, hacer clic en "Puestos de Trabajo" de una empresa, crear/editar/eliminar un puesto.
- Verificar que el `select` de perfiles muestre correctamente los dos grupos.
- Integrar el `jobPositionId` en el flujo de registro de trabajadores (ya preparado en el modelo `Worker`).
