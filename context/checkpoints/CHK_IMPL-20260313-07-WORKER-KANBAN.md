# CHK_IMPL-20260313-07-WORKER-KANBAN
**Fecha**: 2026-03-13
**ID Intervención**: IMPL-20260313-07
**Agente**: SOFIA - Builder
**Estado**: ✅ COMPLETADO (4/4 Gates)

---

## 🎯 Objetivo
Completar el flujo para que los Puestos de Trabajo y sus Perfiles se asuman automáticamente en el modal de citas y se reflejen en la Papeleta del Kanban de Enfermería.

---

## ✅ Entregables Implementados

### 1. Auto-selección de Perfil Médico por Puesto de Trabajo
**Archivo**: `frontend/src/components/AppointmentFormModal.tsx`

**Cambios:**
- Importado `getMedicalProfilesForCompany` para cargar perfiles de la empresa del worker
- Nuevo estado `profiles: MedicalProfileOption[]` y `selectedProfileId: string`
- Interfaz `Worker` actualizada con `jobPosition: { id, name, defaultProfileId } | null`
- `handleWorkerChange` convertido a `async`: al seleccionar un trabajador, carga los perfiles de su empresa y auto-selecciona el `defaultProfileId` de su `JobPosition`
- Nuevo campo **Perfil Médico** en el formulario con badge `✦ Auto por puesto: [nombre]` cuando aplica
- Mensajes de feedback: si la empresa no tiene perfiles o no se ha seleccionado trabajador
- `handleSubmit` pasa `serviceProfileId` a `createAppointment`

### 2. `getWorkers()` con JobPosition
**Archivo**: `frontend/src/actions/worker.actions.ts`

**Cambio**: `include` ahora incluye `jobPosition: { select: { id, name, defaultProfileId } }` para que el modal pueda consumir el `defaultProfileId` sin llamadas adicionales.

### 3. `createAppointment` acepta serviceProfileId
**Archivo**: `frontend/src/actions/appointment.actions.ts`

**Cambio**: Parámetro `serviceProfileId?: string | null` agregado a la función y guardado en `prisma.appointment.create`.

### 4. EventTestsPanel y Kanban de Enfermería (ya estaba implementado)
- `frontend/src/components/EventTestsPanel.tsx` — Componente Kanban de pruebas
- `frontend/src/actions/event-test.actions.ts` — `updateEventTestStatus(id, status)`
- `frontend/src/app/events/[id]/page.tsx` — Conectado en la vista `CHECKED_IN` con `serializedEventTests`

---

## 🐛 Fix Bonus: Errores de Build Pre-existentes Corregidos

| Archivo | Error | Fix |
|---|---|---|
| `frontend/tsconfig.json` | Scripts utilitarios (`import-excel.ts`, `read-excel.ts`, `seed-catalog.ts`) incluidos en compilación | Agregados a `exclude` |
| `frontend/src/actions/admin.actions.ts` | `include: { services: true }` — campo inexistente en `ServiceProfile` | Corregido a `ProfileServices` |
| `frontend/src/app/admin/profiles/page.tsx` | `.services.length` — campo inexistente | Corregido a `.ProfileServices.length` |
| `frontend/src/actions/appointment.actions.ts` | `.medicalEvents.length > 0` — relación es 1:1 (`MedicalEvent?`) no array | Corregido a `if (existingAppointment.medicalEvents)` |

---

## ✅ Soft Gates Validados

| Gate | Estado | Evidencia |
|------|--------|-----------|
| 1. Compilación | ✅ PASS | `pnpm next build` finaliza con routes de `/events/[id]`, `/appointments`, etc. |
| 2. Testing | ✅ N/A | No aplica tests unitarios nuevos (lógica de UI de auto-selección) |
| 3. Revisión | ✅ PASS | Sin regresiones en archivos modificados |
| 4. Documentación | ✅ PASS | Marca de agua `@id IMPL-20260313-07` en comentarios de cambios |

---

## 📁 Archivos Modificados

```
frontend/src/actions/worker.actions.ts          → +jobPosition en getWorkers()
frontend/src/actions/appointment.actions.ts     → +serviceProfileId param + fix relación medicalEvents
frontend/src/components/AppointmentFormModal.tsx → selector de perfil + auto-selección
frontend/src/actions/admin.actions.ts           → fix ProfileServices (pre-existente)
frontend/src/app/admin/profiles/page.tsx        → fix ProfileServices (pre-existente)
frontend/tsconfig.json                          → exclude scripts utilitarios
```

---

## 🔄 Flujo Resultante

```
1. Recepcionista abre modal "Agendar Cita"
2. Selecciona un trabajador con Puesto ← getWorkers() incluye jobPosition
3. Modal auto-carga perfiles de la empresa del trabajador
4. Si el JobPosition tiene defaultProfileId → se auto-selecciona
5. Badge "✦ Auto por puesto: [nombre]" visible al usuario
6. Recepcionista puede cambiar el perfil si es necesario
7. Al guardar → Appointment.serviceProfileId queda seteado
8. En Check-in → EventTests se instancian desde el perfil
9. Enfermería ve la Papeleta Electrónica (EventTestsPanel) en la vista CHECKED_IN
10. Puede marcar cada prueba como COMPLETED / SKIPPED / CANCELLED
```

---

## 🔗 Referencias
- SPEC: `context/SPECs/ARCH-20260225-06-FASE2-MODULOS.md`
- Checkpoint previo: `CHK_IMPL-20260313-06-JOB-POSITIONS-UI.md`
