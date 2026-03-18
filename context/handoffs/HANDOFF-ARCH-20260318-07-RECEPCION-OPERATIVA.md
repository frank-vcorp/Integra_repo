# HANDOFF: Recepción Operativa y Agenda Multi-Sucursal

**Fecha:** 2026-03-18  
**Owner:** INTEGRA  
**Implementación:** SOFIA  
**Revisión:** GEMINI  
**ID de intervención:** ARCH-20260318-07

---

## Objetivo

Cerrar los pendientes operativos más críticos detectados contra las notas de Lety para que recepción pueda operar sin atajos manuales:

1. multi-sucursal por empresa con checkboxes
2. deduplicación de trabajadores al alta
3. corroboración de datos al llegar antes del check-in
4. pantalla independiente con visibilidad simultánea de las 3 agendas

Este handoff es **de ejecución estricta**. Si una pieza bloquea otra, se sigue el orden indicado y se respeta el criterio de corte.

---

## Contexto Validado

### Ya resuelto en sprint previo
- Flujo `Empresa -> Trabajador` en citas
- `Sala y Somatometría` como etapa inicial
- `Agudeza Visual` movida a enfermería
- `DoctorExamForm` enfocado en exploración física
- `EventTestsPanel` / papeleta dinámica por perfil

### Pendientes confirmados contra notas de Lety
- La empresa debe poder operar con varias sucursales permitidas
- El alta de trabajador no debe duplicar registros existentes
- Recepción debe corroborar datos cuando el trabajador llega
- Debe existir una pantalla independiente con las 3 agendas del día

---

## Decisión Técnica

### 1. Multi-sucursal sin romper el flujo actual
- Conservar `defaultBranchId` para UX rápida y autoselección.
- Agregar una relación many-to-many entre `Company` y `Branch` para `allowedBranches`.
- El selector de sucursal en citas debe filtrar por `allowedBranches`; si una empresa no tiene restricciones cargadas, usar fallback seguro:
  - si tiene `allowedBranches`, usar solo esas
  - si no tiene `allowedBranches`, usar todas las sucursales visibles para no bloquear operación heredada

### 2. Duplicados por coincidencia fuerte, no por magia difusa
- No inventar matching complejo en este sprint.
- Usar coincidencia fuerte por:
  - `firstName`
  - `lastName`
  - `dob`
  - y si existe, `nationalId`
- Si hay match fuerte, devolver resultado especial de servidor y ofrecer edición del trabajador existente.
- No regenerar `universalId` de un trabajador existente.

### 3. Corroboración dentro del flujo de llegada
- El check-in no debe crear el evento inmediatamente.
- Primero debe abrir un modal o pantalla de corroboración de datos.
- Solo al confirmar se ejecuta la acción que crea el `MedicalEvent`.
- La actualización permitida en este paso debe ser mínima y segura:
  - teléfono
  - email
  - empresa actual si aplica
  - puesto actual si aplica
- No tocar historial médico previo.

### 4. Pantalla de 3 agendas como vista de lectura operativa
- Crear pantalla nueva, separada de la agenda principal.
- Mostrar 3 columnas o paneles, una por sucursal.
- Debe ser vista de monitoreo operativo, no reemplazo del módulo de citas.
- En este sprint basta con modo lectura y carga del día actual.

---

## Variables de Entorno

No se requieren variables nuevas.

---

## Seguridad

- [ ] Todas las mutaciones deben seguir protegidas por sesión válida.
- [ ] Validar inputs con Zod o validación consistente del proyecto.
- [ ] No loggear datos sensibles del trabajador.
- [ ] No romper integridad histórica de `Worker`, `Appointment`, `MedicalEvent`.
- [ ] Si se agrega nueva ruta operativa, debe respetar el mismo control de acceso del resto del frontend privado.

---

## Orden Obligatorio de Implementación

### Fase A: Modelo y consultas base
1. Extender esquema Prisma para multi-sucursal de empresa.
2. Generar consultas para leer y escribir `allowedBranches`.
3. Ajustar consultas de empresas para que devuelvan:
   - `defaultBranchId`
   - `allowedBranches`

**No avanzar a UI sin esta base.**

### Fase B: UI de empresa + citas
1. Agregar checkboxes de sucursales permitidas en empresa.
2. Filtrar sucursales en el modal de citas según empresa.
3. Mantener autoselección desde `defaultBranchId` solo si pertenece a las permitidas.

### Fase C: deduplicación de trabajadores
1. Agregar búsqueda previa de duplicados en server action.
2. Ajustar modal de trabajador para manejar respuesta:
   - `success`
   - `duplicate_found`
   - `error`
3. Si hay duplicado:
   - mostrar datos básicos del existente
   - ofrecer abrir edición
   - permitir cancelación

### Fase D: corroboración al llegar
1. Insertar paso intermedio antes de `checkInAppointment`.
2. Reusar formulario liviano para actualizar datos básicos.
3. Ejecutar creación de evento solo después de confirmar.

### Fase E: vista 3 agendas
1. Crear pantalla nueva de solo lectura.
2. Exponer acceso en navegación.
3. Mostrar métricas mínimas por sucursal:
   - cantidad de citas del día
   - bloques horarios o lista resumida

---

## Endpoints / Cambios Esperados

### Mutaciones probables
- Server action para actualizar sucursales permitidas por empresa
- Server action o helper de deduplicación de trabajador
- Ajuste a `createWorker`
- Ajuste al flujo de `checkInAppointment` o wrapper previo de corroboración

### Consultas probables
- Obtener empresa con `allowedBranches`
- Obtener agendas del día agrupadas por sucursal

---

## UI/UX Estricto

### Empresas
- Mostrar checkboxes con todas las sucursales disponibles.
- Estado `idle/loading/error/success` obligatorio.
- Debe quedar visible cuál es la sucursal por defecto y cuáles son permitidas.

### Modal de trabajador
- Si no hay duplicados: flujo normal.
- Si hay duplicado: detener guardado automático.
- Mostrar aviso claro, no técnico.
- Acción primaria: `Editar trabajador existente`.
- Acción secundaria: `Cancelar`.

### Corroboración al llegar
- Debe sentirse como parte del check-in, no como otro módulo.
- Mostrar resumen de cita, trabajador y empresa.
- Permitir confirmar sin cambios si los datos son correctos.
- Acción final clara: `Confirmar llegada y abrir expediente`.

### Pantalla de 3 agendas
- Debe poder leerse rápido desde recepción o coordinación.
- Priorizar densidad útil sobre ornamento visual.
- Etiquetas claras por sucursal.

---

## Reglas de No-Regresión

- No romper el flujo ya validado de `Empresa -> Trabajador`.
- No reintroducir `Triaje` en clínica inicial.
- No mover `Agudeza Visual` de vuelta al bloque médico.
- No alterar generación de `EventTests` por perfil.
- No bloquear a empresas existentes que aún no tengan `allowedBranches` configuradas.

---

## Criterios de Aceptación

- [ ] CA-01: Desde empresa se pueden marcar varias sucursales permitidas mediante checkboxes.
- [ ] CA-02: En `Nueva Cita`, al elegir empresa, el selector de sucursal solo muestra sucursales permitidas para esa empresa.
- [ ] CA-03: Si se intenta registrar un trabajador ya existente con coincidencia fuerte, el sistema no crea duplicado y ofrece editar el registro existente.
- [ ] CA-04: El check-in muestra paso de corroboración antes de crear el evento médico.
- [ ] CA-05: Recepción puede confirmar llegada sin modificar datos y entrar al expediente.
- [ ] CA-06: Recepción puede corregir teléfono o email y luego completar check-in sin afectar historial previo.
- [ ] CA-07: Existe una vista nueva con las 3 agendas del día visibles simultáneamente.
- [ ] CA-08: El frontend compila con `pnpm next build`.

---

## Criterio de Corte

Si la migración multi-sucursal resulta más costosa de lo previsto, **NO** dejar una mezcla inconsistente.

Prioridad de entrega si hay recorte:
1. deduplicación
2. corroboración al llegar
3. vista 3 agendas en lectura
4. multi-sucursal completa

Si multi-sucursal no queda terminada, documentar claramente:
- qué quedó hecho en esquema
- qué falta en UI
- qué fallback temporal queda activo

---

## Validación Requerida por SOFIA

### Técnica
- Ejecutar `pnpm next build`
- Revisar errores de TypeScript
- Verificar rutas afectadas mínimas

### Funcional manual mínima
1. Empresa con 2 sucursales permitidas
2. Trabajador nuevo y trabajador duplicado
3. Cita agendada y check-in con corroboración
4. Abrir vista de 3 agendas

### Segunda mano Qodo
- Ejecutar `qodo self-review -y -q` antes de cerrar
- Si Qodo marca regresiones reales, documentarlas en checkpoint

---

## Archivos Probables

- `frontend/prisma/schema.prisma`
- `frontend/src/actions/company.actions.ts`
- `frontend/src/actions/worker.actions.ts`
- `frontend/src/actions/appointment.actions.ts`
- `frontend/src/app/companies/**/*.tsx`
- `frontend/src/components/AppointmentFormModal.tsx`
- `frontend/src/components/WorkerFormModal.tsx`
- `frontend/src/components/CheckInModal.tsx` o componente nuevo
- `frontend/src/app/appointments/page.tsx`
- `frontend/src/app/appointments/overview/page.tsx` o equivalente
- `frontend/src/app/layout.tsx`

---

## Fase 2 Posterior

- Escaneo real de INE / OCR
- Matching tolerante para errores ortográficos y homónimos
- Balance de capacidad entre sucursales
- Vista operativa con métricas de personal por sucursal

---

## Instrucción Final para SOFIA

Implementa en este orden: **modelo -> empresas/citas -> duplicados -> corroboración -> 3 agendas**.  
No optimices prematuramente.  
No abras scope nuevo.  
Cuando termines, genera checkpoint con diff funcional, build y riesgos residuales.