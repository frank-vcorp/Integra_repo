# Checkpoint IMPL-20260313-04 — Papeleta Electrónica

- **Fecha:** 2026-03-13
- **Agente:** SOFIA - Builder
- **ID Intervención:** IMPL-20260313-04
- **SPEC Referencia:** ARCH-20260313-01-CATALOGO-ESTUDIOS-PERFILES.md
- **Commit:** `ac560a7`

---

## ✅ Entregables Implementados

### 1. Schema + Migración
- Nuevo campo `serviceProfileId` (FK nullable) en modelo `Appointment`
- Migración idempotente SQL: `20260313010000_add_service_profile_to_appointment/migration.sql`
- `MedicalProfile` expone relación inversa `appointments[]`
- `db push` aplicado exitosamente a Railway PostgreSQL

### 2. Check-in con instanciación de EventTests
**Archivo:** `frontend/src/actions/appointment.actions.ts` → `checkInAppointment()`

Cambios:
- La query de `existingAppointment` ahora incluye `serviceProfile.tests.test`
- Al crear el `MedicalEvent` se asigna `billingCompanyId` desde `appointment.companyId`
- Después de crear el evento, si hay `serviceProfile`, se llama `tx.eventTest.createMany()` con:
  - `eventId`, `testId`, `testNameSnapshot` (snapshot del nombre), `status: 'PENDING'`
- Todo dentro de la transacción atómica existente (sin riesgo de datos huérfanos)

### 3. Servicio actualizado
**Archivo:** `frontend/src/services/medical-event.service.ts` → `getEventById()`

- Ahora incluye `eventTests` con relación `test` (code, category) ordenados por `createdAt ASC`

### 4. Server Action updateEventTestStatus
**Archivo:** `frontend/src/actions/event-test.actions.ts` (nuevo)

- Validación Zod: `eventTestId` (UUID) + `status` (nativeEnum EventTestStatus)
- Verificación de sesión obligatoria
- Registra `performedById` desde `session.user.id`
- `revalidatePath` automático para la ruta del evento

### 5. Componente EventTestsPanel (Client Component)
**Archivo:** `frontend/src/components/EventTestsPanel.tsx` (nuevo)

- Recibe `eventTests[]` y `readonly?: boolean`
- Estado local optimista por prueba (`useState` + `useTransition`)
- Checkbox visual: click rápido PENDING ↔ COMPLETED
- Botones secundarios: ⏭ Omitir / ✕ Cancelar / ↩ Restablecer
- Barra de progreso (completadas/total)
- Estado vacío si no hay pruebas programadas

### 6. Event Page integrado
**Archivo:** `frontend/src/app/events/[id]/page.tsx`

- Import de `EventTestsPanel`
- Serialización defensiva de `event.eventTests` a JSON puro
- `EventTestsPanel` montado junto a `TriageForm` en la vista `CHECKED_IN` (paso 2)
- `readonly={currentStep > 2}` para pasos posteriores

---

## 🔬 Soft Gates

| Gate | Estado | Evidencia |
|------|--------|-----------|
| **Gate 1: Compilación** | ✅ | `npx tsc --noEmit` sin errores. `next build` exitoso. |
| **Gate 2: Testing** | ⚠️ N/A | No hay tests E2E para este flujo todavía. Flujo manual verificable. |
| **Gate 3: Revisión** | ✅ | Validación Zod, sesión obligatoria, transacción atómica. |
| **Gate 4: Documentación** | ✅ | Este Checkpoint + JSDoc en archivos + comentarios IMPL-20260313-04. |

---

## 🔄 Flujo completo resultante

```
Appointment (con serviceProfileId) 
    → checkInAppointment()
        → tx.medicalEvent.create({ billingCompanyId })
        → tx.eventTest.createMany([{ testNameSnapshot, PENDING }])
    → Event Page (CHECKED_IN)
        → EventTestsPanel (checkboxes)
            → updateEventTestStatus() → EventTestStatus actualizado
```

---

## 📝 Notas Técnicas

- `billingCompanyId` toma el valor de `appointment.companyId` (empresa contratante).
  Si en el futuro la empresa facturadora es diferente, se puede exponer como campo separado.
- El `testNameSnapshot` garantiza historial inmutable aunque el `MedicalTest` sea editado.
- El `serviceProfileId` en `Appointment` es opcional: si una cita no tiene perfil, el Check-in funciona igual que antes (sin EventTests).

---

## 🎯 Próximos Pasos Recomendados

1. **UI de creación de cita**: Exponer selector de `MedicalProfile` en `AppointmentFormModal`
2. **Filtro por género**: Respetar `targetGender` del `MedicalTest` al instanciar (requiere ARCH)
3. **Tests E2E**: Cubrir el flujo Check-in → EventTest en Playwright
4. **Gate 2 pendiente**: Solicitar a GEMINI auditoría con Qodo cuando se agregue el selector de perfil en formulario de cita
