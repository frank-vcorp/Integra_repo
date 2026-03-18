# HANDOFF CORRECTIVO: Cierre real de Recepción Operativa

**Fecha:** 2026-03-18
**Owner:** INTEGRA
**Implementación:** SOFIA
**ID de intervención:** ARCH-20260318-08
**Base:** ARCH-20260318-07

---

## Motivo del relanzamiento

La ejecución previa compila, pero no cumple el handoff original de recepción operativa. Este relanzamiento es correctivo y de alcance cerrado. No debes abrir scope nuevo.

---

## Incumplimientos verificados

### 1. Corroboración no montada en UI
- En `frontend/src/app/appointments/page.tsx` ya existe estado para `corroborationData` y carga de datos previa al check-in.
- Pero no se renderiza `CorroborationModal` en el JSX.
- Resultado actual: el check-in no muestra el paso de corroboración.

### 2. Ruta de 3 agendas inexistente
- Existe link a `/appointments/overview`.
- No existe la ruta ni la pantalla.
- Resultado actual: navegación rota / feature incompleta.

### 3. Multi-sucursal quedó solo en backend
- Prisma y actions ya manejan `allowedBranches`.
- No existe UI de checkboxes para administrar sucursales permitidas por empresa.
- El modal de citas sigue mostrando todas las sucursales sin filtrar por empresa.

### 4. Duplicados sin resolución operativa
- `createWorker` ya devuelve `duplicate_found` y `existingWorker`.
- `WorkerFormModal` lo trata como error genérico.
- Resultado actual: no ofrece editar trabajador existente ni resolver el caso desde recepción.

---

## Objetivo del correctivo

Cerrar completamente los 4 puntos anteriores y dejar el flujo operable sin ambigüedad:

1. corroboración visible y funcional antes de crear expediente
2. pantalla real de 3 agendas
3. UI real de multi-sucursal con checkboxes y filtro en citas
4. resolución real de duplicados con opción de editar existente

---

## Implementación obligatoria

### A. Corroboración

**Archivo base:** `frontend/src/app/appointments/page.tsx`

- Montar `CorroborationModal` cuando `corroborationData` exista.
- Al cerrar, debe limpiar `corroborationData`.
- Al confirmar, el modal ya debe continuar hacia `checkInAppointment` y abrir expediente.
- Al completar check-in, refrescar agenda para que el estado visual quede consistente.

### B. Vista 3 agendas

**Ruta obligatoria:** `frontend/src/app/appointments/overview/page.tsx`

- Crear la página.
- Consumir `getAppointmentsForOverview(date)`.
- Mostrar 3 columnas o paneles por sucursal.
- Mostrar, como mínimo:
  - nombre de sucursal
  - total de citas del día
  - lista resumida con hora + trabajador + empresa + estado
- Debe existir manejo claro de estado vacío.
- No reemplaza la agenda principal; es solo monitoreo.

### C. Multi-sucursal por empresa

**Archivos probables:**
- `frontend/src/app/companies/[id]/page.tsx`
- `frontend/src/app/companies/[id]/JobPositionsPanel.tsx` o componente nuevo si prefieres separar responsabilidades
- `frontend/src/components/AppointmentFormModal.tsx`

**Requisitos:**
- En detalle de empresa, agregar un bloque visible de "Sucursales Permitidas" con checkboxes.
- Cargar todas las sucursales disponibles.
- Mostrar también la sucursal por defecto actual, si existe.
- Guardar mediante `updateCompanyAllowedBranches`.
- En `AppointmentFormModal`, al seleccionar empresa:
  - si tiene `allowedBranches`, mostrar solo esas
  - si no tiene `allowedBranches`, fallback a todas las sucursales
- No romper autoselección de `defaultBranchId`.
- Si `defaultBranchId` no está dentro de las permitidas, no autoseleccionar una inválida.

### D. Duplicados de trabajador

**Archivo base:** `frontend/src/components/WorkerFormModal.tsx`

- Manejar explícitamente respuesta del servidor:
  - `created`
  - `duplicate_found`
  - `error`
- Si hay `duplicate_found`, detener alta y mostrar tarjeta/modal/estado claro con:
  - nombre del trabajador existente
  - ID universal
  - empresa si existe
- Acción primaria: editar trabajador existente.
- Acción secundaria: cancelar.
- No ocultar este caso dentro de `setError('Error al guardar')`.

---

## Reglas de no regresión

- No romper flujo `Empresa -> Trabajador`.
- No romper autoasignación de perfil médico por puesto.
- No reintroducir cambios clínicos en triaje/sala.
- No tocar lógica de `EventTests` fuera de lo necesario.

---

## Criterios de aceptación binarios

- [ ] CA-01: Al hacer check-in desde agenda aparece modal de corroboración.
- [ ] CA-02: Cerrar modal cancela flujo sin crear expediente.
- [ ] CA-03: Confirmar desde modal crea expediente y navega al evento.
- [ ] CA-04: `/appointments/overview` existe y renderiza 3 agendas del día.
- [ ] CA-05: En empresa se pueden marcar sucursales permitidas con checkboxes.
- [ ] CA-06: En nueva cita, la lista de sucursales se filtra por empresa cuando hay `allowedBranches`.
- [ ] CA-07: Si una empresa no tiene `allowedBranches`, el flujo heredado sigue operando con fallback a todas.
- [ ] CA-08: Si se intenta crear trabajador duplicado, no se crea un nuevo registro y se ofrece editar el existente.
- [ ] CA-09: `pnpm next build` pasa.

---

## Criterio de corte

No cierres la tarea si solo queda backend o solo queda UI. Esta vez el cierre es funcional completo.

Si algo bloquea una parte, documenta exactamente qué quedó hecho y qué no, pero no declares completado.

---

## Entrega esperada

- Código corregido
- Build validado con `pnpm next build`
- Checkpoint nuevo del correctivo
- Resumen corto de archivos tocados y residual risks