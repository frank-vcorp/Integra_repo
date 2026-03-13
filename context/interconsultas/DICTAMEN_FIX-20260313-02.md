# DICTAMEN TÉCNICO: Falla silente y fuga transaccional en Check-in de Citas
- **ID:** FIX-20260313-02
- **Fecha:** 2026-03-13
- **Solicitante:** [GEMINI / SOFIA]
- **Estado:** ✅ VALIDADO

### A. Análisis de Causa Raíz
Se han identificado dos escenarios ocultos severos en la función `checkInAppointment` de `frontend/src/actions/appointment.actions.ts`:

1. **Generación Silente de "Papeletas Fantasma" sin pruebas**:
   La instanciación depende de `existingAppointment.serviceProfile`. Si una Cita no tiene asignado un `serviceProfileId` (lo cual ocurre por defecto ya que `createAppointment` lo permite omitir), la condición simplemente se evita por ser falsy. El resultado es que el código inserta un `MedicalEvent` vacío pero sin ningún `EventTest`. Al saltar al tablero de Papeleta Electrónica, el médico recepcionista verá al paciente pero estará trabado en un "Kanban sin tarjetas/pruebas", creando un estado inconsistente en la lógica de negocio.
   
2. **Pseudo-Atomicidad de Transacción y Deadlocks (`logAudit`)**:
   En la fase terminal del Check-in, existe el código `await logAudit(...)` dentro de `prisma.$transaction(...)`. Esta llamada introduce los siguientes problemas en cascada:
   - `logAudit` captura todos sus propios errores y retorna `{ success: false }` sin lanzar `throw`. El comentario original es falso: "Si falla auditar, revierte todo". Prisma no tiene cómo enterarse de ese fallo de auditoría, resultando en que la Cita queda check-inada parcialmente impidiendo un re-intento.
   - `logAudit` ejecuta un fetching a Prisma sobre el cliente global (`prisma`) provocando operaciones fuera de la transacción activa (`tx`).
   - Peor aún, invoca un `getServerSession` asíncrono interno. Consultar red/sesión dentro de la capa interactiva de la base de datos bloquea el pool de Prisma en producción, lo cual es propenso a arrojar Transaction Timeouts masivos en momentos de concurrencia.

### B. Justificación de la Solución
- **Fijar Integridad de Pruebas**: Añadir un throw explícito que impida al Triage/Recepción hacer Check-in de un paciente que no tiene configurado su perfil médico (Service Profile). Todo paciente debe tener pruebas asignadas para derivarlo al Kanban.
- **Fijar Fuga Transaccional (ACID)**: Reemplazar el llamado a `logAudit` por una inserción manual transaccional `tx.auditLog.create` usando la id de sesión ya disponible de antemano en `checkInAppointment`. Así, si falla, efectivamente lanza error y la DB retrocede, honrando la verdadera atomicidad ACID en las bitácoras.

### C. Instrucciones de Handoff para GEMINI/SOFIA
- [X] El parche ya ha sido inyectado en `frontend/src/actions/appointment.actions.ts`.
- **SOFIA**: Asegúrate en el UI `AppointmentForm` que el `serviceProfileId` sea mandatorio o se pida explícitamente en el punto de recepción si el paciente es check-inado sin él.
- **GEMINI**: Monitorizar logs post-implementación para garantizar que no se levanten más "Papeletas Electrónicas" huérfanas de pruebas en base de datos.
