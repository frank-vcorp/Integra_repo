# Checkpoint ARCH-20260318-09 — Validación Final Recepción Operativa

**Fecha:** 2026-03-18  
**Agente:** INTEGRA - Arquitecto  
**ID de intervención:** ARCH-20260318-09  
**Base validada:** HANDOFF-ARCH-20260318-08 / IMPL-20260318-09

---

## Resultado

Se validó el correctivo de SOFIA contra los criterios binarios CA-01 a CA-09 del handoff ARCH-20260318-08.

Durante la auditoría se detectó un hueco funcional residual en CA-08:
- el flujo de duplicado ofrecía navegar a `/workers?edit=id`
- la pantalla de trabajadores no consumía ese parámetro
- por lo tanto la acción primaria "Editar trabajador existente" no terminaba de resolver el caso

Se corrigió ese punto y se revalidó compilación completa.

---

## Ajuste adicional aplicado por INTEGRA

### 1. Apertura automática de edición por query param

**Archivos modificados:**
- `frontend/src/app/workers/page.tsx`
- `frontend/src/components/WorkersTable.tsx`

**Cambio:**
- `workers/page.tsx` ahora recibe `searchParams` con `await` compatible con Next 16
- pasa `edit` hacia `WorkersTable`
- `WorkersTable` abre automáticamente `WorkerFormModal` cuando recibe `?edit=<workerId>`
- la URL se limpia con `router.replace(pathname)` para evitar reaperturas espurias

**Resultado operativo:**
- desde el modal de duplicado, la acción "Editar trabajador existente" ahora sí abre el modal de edición correcto en `/workers`

---

## Validación final

| Criterio | Estado | Evidencia |
|---------|--------|-----------|
| CA-01 Corroboración visible | ✅ | `CorroborationModal` montado en agenda |
| CA-02 Cancelación sin expediente | ✅ | flujo controlado por modal antes de `checkInAppointment` |
| CA-03 Confirmación crea expediente | ✅ | modal confirma y navega a `/events/[id]` |
| CA-04 Vista 3 agendas existe | ✅ | ruta `/appointments/overview` compilada |
| CA-05 Checkboxes multi-sucursal | ✅ | `AllowedBranchesPanel` integrado en empresa |
| CA-06 Filtro de sucursales en cita | ✅ | `AppointmentFormModal` filtra por `allowedBranches` |
| CA-07 Fallback heredado | ✅ | fallback explícito a todas si no hay restricciones |
| CA-08 Duplicado resuelto operativamente | ✅ | `/workers?edit=id` ahora abre edición real |
| CA-09 Build completo | ✅ | `pnpm next build` exitoso |

---

## Soft Gates

| Gate | Estado | Evidencia |
|------|--------|-----------|
| Compilación | ✅ | `pnpm next build` exitoso tras ajuste final |
| Testing | ⚠️ | sin pruebas automatizadas nuevas; validación manual/arquitectónica |
| Revisión | ✅ | auditoría directa de código + build + cierre de hueco residual |
| Documentación | ✅ | checkpoint correctivo de SOFIA + este checkpoint final |

---

## Riesgos residuales no bloqueantes

- Next.js sigue mostrando warning por convención `middleware` deprecada hacia `proxy`
- no se agregaron pruebas automatizadas para overview ni para duplicate flow

---

## Veredicto

**Estado final del sprint:** VERDE.

Recepción operativa queda cerrada para este alcance:
- corroboración antes de check-in
- vista independiente de 3 agendas
- multi-sucursal administrable por empresa
- deduplicación con resolución real hacia edición
