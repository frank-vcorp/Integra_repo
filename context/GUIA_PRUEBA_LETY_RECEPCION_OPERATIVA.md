# GUÍA DE VALIDACIÓN CON LETY — RECEPCIÓN OPERATIVA

**Fecha:** 2026-03-18  
**Proyecto:** Residente Digital / AMI  
**ID de intervención:** ARCH-20260318-10  
**Objetivo de la sesión:** Validar con Lety que el flujo operativo de recepción ya refleja lo acordado en sus notas del 6 de marzo.

---

## Qué se valida en esta sesión

Esta guía no repite todo el flujo B2B clínico. Se enfoca en los 4 cierres operativos más sensibles para Lety:

1. **Multi-sucursal por empresa** con checkboxes
2. **Detección de duplicados** al registrar trabajador
3. **Corroboración de datos** al llegar antes del check-in
4. **Vista independiente de 3 agendas** para monitoreo cross-sucursal

---

## Duración sugerida

**30 a 45 minutos** con Lety frente a pantalla.

---

## Preparación previa

Antes de iniciar la llamada o revisión con Lety:

1. Confirmar que el frontend esté levantado.
2. Tener al menos:
   - 1 empresa cliente existente
   - 2 o 3 sucursales dadas de alta
   - 1 trabajador ya existente en el padrón
   - permisos para editar empresa, trabajadores y citas
3. Tener abierta esta guía y el walkthrough general si se requiere contexto adicional.

Documento de apoyo general: [context/GUIA_WALKTHROUGH_B2B.md](context/GUIA_WALKTHROUGH_B2B.md)

---

## Guion recomendado con Lety

### Bloque 1 — Multi-sucursal por empresa

**Objetivo:** Confirmar que la empresa ya no queda amarrada a una sola sucursal.

**Ruta:** `/companies`  
**Pantalla objetivo:** detalle de empresa

#### Pasos

1. Entrar a una empresa cliente real o de prueba.
2. Localizar el bloque **Sucursales Permitidas**.
3. Marcar 2 o más sucursales por checkbox.
4. Guardar cambios.
5. Pedir a Lety que confirme si esta mecánica coincide con su operación esperada.

#### Qué debe observar Lety

- Ya no hay una restricción implícita a una sola sucursal.
- La empresa puede operar con varias sucursales permitidas.
- La interacción por checkbox es entendible para recepción o coordinación.

#### Pregunta directa para Lety

> “¿Así es como esperabas administrar las sucursales permitidas por empresa?”

#### Resultado esperado

- **Aprobado** si Lety confirma que la lógica por checkbox representa el acuerdo operativo.

---

### Bloque 2 — Cita filtrada por empresa

**Objetivo:** Confirmar que la selección de sucursal ya responde a la empresa elegida.

**Ruta:** `/appointments`

#### Pasos

1. Abrir **Agendar Cita**.
2. Seleccionar la misma empresa del bloque anterior.
3. Observar el selector de sucursal.
4. Verificar con Lety que solo aparezcan las sucursales permitidas para esa empresa.
5. Si la empresa no tiene sucursales marcadas, verificar que el sistema no se bloquee y use fallback.

#### Qué debe observar Lety

- La lista de sucursales ya no muestra opciones ajenas cuando la empresa sí tiene restricciones.
- El sistema no rompe operación heredada si la empresa aún no está configurada.

#### Pregunta directa para Lety

> “¿Con este filtro ya se evita mandar por error trabajadores a una sucursal no autorizada?”

#### Resultado esperado

- **Aprobado** si Lety confirma que el comportamiento refleja su lógica de envío por empresa.

---

### Bloque 3 — Duplicado de trabajador

**Objetivo:** Confirmar que recepción no crea registros dobles cuando el colaborador ya existe.

**Ruta:** `/workers`

#### Preparación sugerida

Usar un trabajador que ya exista en el padrón con nombre y fecha de nacimiento conocidos.

#### Pasos

1. Abrir **Registrar Trabajador**.
2. Capturar los mismos datos del trabajador existente.
3. Guardar.
4. Mostrar a Lety la pantalla de advertencia de duplicado.
5. Dar clic en **Editar Trabajador Existente**.
6. Confirmar que se abre el modal de edición correcto en el padrón.

#### Qué debe observar Lety

- El sistema no genera un segundo registro.
- Se muestran datos del colaborador existente.
- La acción primaria realmente permite resolver el caso editando, no solo muestra alerta.

#### Pregunta directa para Lety

> “¿Con este flujo ya te sentirías segura de que recepción no va a duplicar trabajadores por error?”

#### Resultado esperado

- **Aprobado** si Lety confirma que el sistema propone actualizar al trabajador existente en lugar de duplicarlo.

---

### Bloque 4 — Corroboración al llegar

**Objetivo:** Confirmar que el check-in ya incluye el paso operativo que Lety pidió al arribo del trabajador.

**Ruta:** `/appointments`

#### Preparación sugerida

Tener una cita de hoy en estado pendiente.

#### Pasos

1. Ubicar una cita del día.
2. Presionar el botón de check-in.
3. Mostrar a Lety el modal de **Corroboración de Datos**.
4. Revisar con ella que el modal enseña al trabajador, empresa, puesto, expediente y datos de contacto.
5. Probar dos escenarios:
   - **Escenario A:** cerrar el modal sin confirmar
   - **Escenario B:** confirmar sin cambios o corrigiendo teléfono/email
6. En el escenario B, validar que el sistema sí abra el expediente después de confirmar.

#### Qué debe observar Lety

- El expediente no se abre de golpe sin corroboración previa.
- Recepción puede confirmar o corregir datos básicos antes de continuar.
- La corrección se siente parte del check-in, no otro módulo separado.

#### Preguntas directas para Lety

> “¿Este paso refleja lo que hace tu recepción cuando el trabajador llega?”

> “¿Te faltaría algún dato crítico en esta corroboración?”

#### Resultado esperado

- **Aprobado** si Lety confirma que este modal cubre la validación mínima operativa de llegada.

---

### Bloque 5 — Vista de 3 agendas simultáneas

**Objetivo:** Confirmar que coordinación ya puede observar carga operativa entre sucursales en una sola pantalla.

**Ruta:** `/appointments/overview`

#### Pasos

1. Abrir la vista de 3 agendas.
2. Revisar las columnas por sucursal con Lety.
3. Cambiar la fecha si es necesario.
4. Mostrar totales, citas pendientes y completadas por sucursal.
5. Validar si esta vista le sirve para decidir reubicación de personal.

#### Qué debe observar Lety

- Hay una vista separada, no mezclada con la agenda principal.
- Se puede comparar rápidamente la carga entre sucursales.
- La pantalla es de lectura y monitoreo, que era el alcance acordado.

#### Pregunta directa para Lety

> “¿Con esta vista ya podrías tomar la decisión de mover personal entre sucursales cuando una esté saturada?”

#### Resultado esperado

- **Aprobado** si Lety confirma que la vista es suficiente para monitoreo operativo diario.

---

## Matriz rápida de validación en vivo

| Punto | Ruta | Validación esperada | Estado con Lety | Observaciones |
|------|------|---------------------|-----------------|---------------|
| Multi-sucursal por empresa | `/companies/[id]` | Checkboxes funcionales | ☐ | |
| Filtro de sucursales en cita | `/appointments` | Sucursales responden a empresa | ☐ | |
| Duplicado de trabajador | `/workers` | No duplica y permite editar existente | ☐ | |
| Corroboración al llegar | `/appointments` | Modal antes de abrir expediente | ☐ | |
| Vista 3 agendas | `/appointments/overview` | Monitoreo útil por sucursal | ☐ | |

---

## Criterio de éxito de la sesión

La sesión con Lety se considera exitosa si al final ella confirma estas 3 ideas:

1. **“Así sí refleja mi operación de recepción.”**
2. **“Ya no veo el riesgo principal de duplicados o sucursal incorrecta.”**
3. **“La vista de agendas sí me sirve para coordinar personal.”**

---

## Si Lety detecta algo durante la sesión

Registrar de inmediato el hallazgo con esta estructura:

- **Pantalla:**
- **Qué esperaba Lety:**
- **Qué hizo el sistema:**
- **Impacto operativo:**
- **¿Bloquea salida a uso real?: Sí / No**

---

## Cierre sugerido con Lety

Al terminar, hacer estas dos preguntas finales:

1. **“De estos 4 puntos, ¿cuál ya sientes listo para operación real?”**
2. **“¿Qué detalle todavía te haría ruido antes de usarlo en clínica?”**

Eso permite separar feedback de:

- ajuste fino de UX
- observación operativa real
- blocker verdadero
