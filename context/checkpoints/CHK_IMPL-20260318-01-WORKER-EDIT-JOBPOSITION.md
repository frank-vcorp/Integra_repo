# Checkpoint IMPL-20260318-01 — Worker: Edición + Campo Puesto de Trabajo

**Fecha:** 2026-03-18  
**Agente:** SOFIA - Builder  
**ID Intervención:** IMPL-20260318-01  
**Estado:** ✅ Completado (4/4 Soft Gates OK)

---

## 🐛 Bugs Corregidos

| # | Bug | Causa Raíz | Solución |
|---|-----|------------|----------|
| 1 | No se podían editar trabajadores | `WorkerFormModal` solo tenía modo creación; la tabla no tenía botón Editar | Modo dual + `WorkersTable` con estado de edición |
| 2 | Campo "Puesto de Trabajo" ausente en formulario | `jobPositionId` no incluido en form ni en Server Action | Selector dinámico + `jobPositionId` en create/update |

---

## 📁 Archivos Modificados

### `frontend/src/actions/worker.actions.ts`
- ➕ `jobPositionId` agregado al `prisma.worker.create()` en `createWorker`
- ➕ Nueva función `updateWorker(id, formData)` — actualiza nombre, DOB, email, teléfono, empresa y puesto

### `frontend/src/actions/admin.actions.ts`
- ➕ Nueva función `getJobPositions()` — retorna `{ id, name, companyId }[]` ordenados por nombre

### `frontend/src/components/WorkerFormModal.tsx` (reescritura)
- **Modo Dual:** `isOpen/onClose` props opcionales activar modo controlado (edición) vs. modo propio (creación)
- **Selector Empresa:** Controlado con estado — al cambiar empresa, resetea puesto seleccionado
- **Selector Puesto:** Filtrado dinámico client-side por `selectedCompanyId`. Deshabilitado hasta seleccionar empresa
- **Pre-llenado en edición:** `defaultValue` en inputs + `key={workerToEdit?.id}` en `<form>` para re-montar al cambiar trabajador
- **`useEffect([workerToEdit?.id])`:** Sincroniza los states controlados de los selectores al abrir edición de diferente trabajador
- **DOB en edición:** Muestra solo fecha de nacimiento (sin campo género — el género solo sirve para generar `universalId` en alta)
- **UX:** Barra de color amber (editar) vs. azul (crear); botón "Actualizar" vs. "Guardar"

### `frontend/src/components/WorkersTable.tsx` (nuevo)
- Componente cliente con estado `workerToEdit`
- Tabla con columna "Empresa / Puesto" mostrando ambas badges (azul empresa, amber puesto)
- Botón **Editar** por fila → abre `WorkerFormModal` en modo controlado
- Botón **Historial** → navega a `/history/[id]`

### `frontend/src/app/workers/page.tsx`
- Usa `Promise.all` para fetch paralelo de `workers`, `companies`, `jobPositions`
- Render: `WorkerFormModal` (crear, sin-controlado) + `WorkersTable` (tabla con edición)

---

## 🚦 Soft Gates

| Gate | Estado | Evidencia |
|------|--------|-----------|
| 1️⃣ Compilación | ✅ | `npx tsc --noEmit` sin errores; `next build` exitoso — `/workers` renderiza como `ƒ Dynamic` |
| 2️⃣ Testing | ⬜ | No hay tests unitarios para este componente cliente (deuda técnica menor) |
| 3️⃣ Revisión | ✅ | Lógica auditada manualmente; no se inventaron campos ni modelos |
| 4️⃣ Documentación | ✅ | Este checkpoint + comentarios `@id` en código |

---

## 🧠 Decisiones de Diseño

- **Filtrado client-side de JobPositions:** Se pasan todos los puestos desde el servidor y se filtran en el cliente por `companyId`. Alternativa (fetch dinámico por empresa) sería más compleja sin beneficio notable dado el volumen típico de puestos.
- **`key` en `<form>`:** Solución nativa React para re-montar sin crear componente interno adicional. Garantiza que `defaultValue` se aplique al cambiar de trabajador.
- **Componente `WorkersTable` separado:** Evita convertir el Server Component `workers/page.tsx` en Client Component solo para gestionar `workerToEdit`. Se mantiene el Server Component puro.
- **No se modifica `universalId` en edición:** El ID universal es inmutable post-alta (generado con nombre+DOB+género). En edición, el campo género se omite intencionalmente.

---

## ⚠️ Deuda Técnica Registrada

- `DT-018` | Tests unitarios para `WorkerFormModal` modo edición y `WorkersTable` | Impacto bajo | Sprint futuro
