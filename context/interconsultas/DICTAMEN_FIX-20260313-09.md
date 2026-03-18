# DICTAMEN TÉCNICO: Análisis Forense de Flujo Corporativo y Trazabilidad (Edge Cases)
- **ID:** FIX-20260313-09
- **Fecha:** 2026-03-13
- **Solicitante:** INTEGRA
- **Estado:** ❌ REQUIERE MÁS CONTEXTO (Escalar a INTEGRA / SOFIA)

### A. Análisis de Causa Raíz (Hallazgos Forenses)

Se analizó el ciclo de vida: `JobPosition -> Worker -> Appointment -> CheckIn -> EventTest`, encontrando 4 vulnerabilidades o Edge Cases críticos en la inmutabilidad y la trazabilidad corporativa B2B:

1. **Borrado de JobPosition**: 
   - A nivel base de datos, Prisma usa `RESTRICT` por defecto. Un `JobPosition` no puede borrarse si tiene `Workers` atados. Esto es **seguro**. 
   - Las citas sobreviven porque copian el `serviceProfileId` al momento de ser agendadas (ver `AppointmentFormModal.tsx` línea 200+).

2. **La Mutación Mágica de Pruebas Clínicas (Fuga de Facturación)**:
   - Si la configuración del `MedicalProfile` cambia (se le añaden o quitan `MedicalTest` en la relación `ProfileTest`) **después** de que el candidato agendó su `Appointment` pero **antes** del `Check-in`, la lógica actual en `appointment.actions.ts:checkInAppointment` jala la batería de pruebas en tiempo real (`existingAppointment.serviceProfile.tests`).
   - *Impacto*: El trabajador será evaluado (y la empresa facturada) con la batería NUEVA, rompiendo la cotización original B2B. El snapshot de pruebas ocurre demasiado tarde (en el CheckIn) y no en el Scheduling.

3. **Pérdida Histórica del "Puesto de Trabajo" Operativo (Traceability Bug)**:
   - Ni `Appointment` ni `MedicalEvent` guardan a qué `JobPosition` específico aplicaba ese evento clínico. 
   - *Impacto*: En Medicina del Trabajo, la aptitud depende del puesto. Si el `Worker` es ascendido o cambiado lateralmente (modificando `Worker.jobPositionId` en el futuro), todo su historial de `MedicalEvent`s pasados parecerá que fueron hechos para el PUESTO NUEVO. 

4. **Inmutabilidad Clínica Incompleta**:
   - Al generarse el `EventTest`, se hace un excelente trabajo capturando `testNameSnapshot`.
   - Sin embargo, los `options` (valores de referencia o campos de selección en `MedicalTest`) **no se capturan**. Si el administrador global cambia las reglas de un test en el catálogo referencial, los `selectedOption` históricos de eventos pasados pueden perder contexto o romper interfaces de frontend.

### B. Justificación de la Solución (Acciones Previstas)

1. **Snapshot de Puesto en el Tiempo**:
   Es indispensable extender el esquema transaccional para que el Evento Clínico no pierda memoria de su propósito original.
2. **Congelamiento de Pruebas B2B**:
   Si una empresa emite una cita con un Perfil "A", y luego muta el Perfil "A", o bien se genera versionamiento de perfiles o copiamos los Test IDs en la Cita misma.
3. **Inmutabilidad en UI**: Las interfaces para mostrar el detalle de `EventTest` no deben depender de `MedicalTest.options` en vivo para no crashear con la data histórica.

### C. Instrucciones de Handoff para INTEGRA / SOFIA

**Para INTEGRA (Arquitectura)**:
- Por favor define en una SPEC B2B si:
  a) ¿`Appointment` y `MedicalEvent` deben tener `jobPositionSnapshot` String o un ID clavado histórico?
  b) ¿Las pruebas deben ser inmutadas en el `Appointment` o está bien que se actualicen en el `Check In`?

**Para SOFIA (Implementadora)**:
- Una vez INTEGRA defina, requerimos refactorizar `schema.prisma`:
  - `MedicalEvent` -> Añadir `jobPositionSnapshot String?`.
  - `EventTest` -> Añadir `testOptionsSnapshot Json?` para inmutabilidad completa obligatoria por la NOM-030.
