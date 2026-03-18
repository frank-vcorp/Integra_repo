# 🗺️ GUÍA DE PRUEBA DE FLUJO COMPLETO (B2B + KANBAN)
**Fecha:** Actualizada 2026-03-18 — Alineación con flujo real AMI (Notas de Lety)
**Objetivo:** Validar el viaje completo del paciente desde la configuración corporativa hasta la ejecución de sus pruebas médicas en piso.

> **Nomenclatura usada en el sistema:**
> - **Reception** → Tablero operativo (`/reception`). Aquí vive el Kanban de pacientes activos.
> - **Sala y Somatometría** → Primer bloque clínico que ve la enfermera al abrir un expediente (antes llamado "Triaje").
> - **Agudeza Visual** → Captura en sala de enfermería, dentro del mismo bloque de Sala y Somatometría.

---

## 🧑‍💻 PASO 1: Validación del Core Clínico
1. Ve a `http://localhost:3005/admin/clinical-catalog`
2. **Qué observar:** Verifica que exista el catálogo importado (~150 pruebas). Si quieres, crea una nueva prueba manualmente para comprobar el formulario de guardado y restricción de sexo.

## 📦 PASO 2: Armar el Combo (Perfil Médico)
1. Ve a `http://localhost:3005/admin/medical-profiles`
2. Crea un Perfil nuevo (Ej: *"Tóxico y Alturas Sodexo"*).
3. Entra a editar y agrégale 3-4 estudios del catálogo (Ej: Antidoping de 5 elementos, Audiometría, Radiografía de Columna).
4. **Nota:** Puedes dejar la empresa vacía para que sea un perfil general, o asignarle una para que sea "privado".

## 🏢 PASO 3: Configuración Dinámica B2B (Puestos)
1. Ve a `http://localhost:3005/companies` y entra a una empresa cliente (Ej: Sodexo o Safran).
2. Localiza la pestaña/botón de **"Puestos de Trabajo"**.
3. Crea un puesto nuevo llamado *"Técnico en Alturas"*.
4. Al crearlo, en la lista desplegable de Perfil Médico, elige el combo que armaste en el **Paso 2**.

## 👷 PASO 4: Contratación del Talento
1. Ve a `/workers` (Lista de Trabajadores).
2. Crea un nuevo empleado o edita uno existente.
3. Asígnalo a la Empresa (Sodexo) y asígnale el Puesto (*Técnico en Alturas*).

## 📅 PASO 5: La Cita Automatizada (Flujo Empresa → Trabajador)
1. Ve a `/appointments` (Citas).
2. Da clic en "Nueva Cita".
3. **Paso 1 del modal:** Selecciona la **Empresa** (Sodexo). El sistema filtra automáticamente los trabajadores de esa empresa.
4. **Paso 2 del modal:** Selecciona al trabajador del **Paso 4**.
5. **El Punto Mágico:** En cuanto lo elijas, el sistema dice *"✦ Auto por puesto: Técnico en Alturas"* e incrusta el Perfil Médico sin buscarlo.
6. Guarda la cita.

## 🏥 PASO 6: La Llegada a la Clínica (Check-In)
1. En la lista de `/appointments`, busca la cita de hoy y dale al botón de **Check-In**.
2. **Qué sucede:** El sistema crea el Evento Médico y redirige al tablero de **Reception** (`/reception`).

## 🖥️ PASO 7: Reception — El Tablero Operativo
1. Ve a `/reception` (o **"Piso Clínico"** en el menú lateral).
2. Aquí está el **Kanban** con todas las columnas: Ingreso, En Sala, Estudios, Validación.
3. Localiza el expediente recién creado en la columna **"En Sala"**.
4. Da clic en el nombre del trabajador para abrir su expediente.

## 📋 PASO 8: Sala y Somatometría (Enfermería)
1. Al abrir el expediente, el primer bloque clínico se llama **"Sala y Somatometría"** (ya no dice "Triaje").
2. **Qué captura enfermería:**
   - ⚖️ Peso, Talla, IMC calculado automáticamente
   - 💓 Signos Vitales (TA, Frecuencia Cardíaca, Temperatura)
   - 👁️ **Agudeza Visual** (en el mismo bloque, justo debajo de signos vitales)
3. Guarda Somatometría y luego Agudeza Visual. El paciente avanza a Consultorio.

## 📋 PASO 9: Papeleta de Estudios
1. En la misma vista de expediente (Sala / estado `CHECKED_IN`), observa el panel **"Papeleta / Estudios Asignados"**.
2. Verás la lista exacta de las pruebas del perfil médico asignado.
3. **La Acción Final:** Marca estudios como *"COMPLETADO"*, *"OMITIDO"* o *"CANCELADO"*.

---
> *Una vez validado esto, estaremos listos para capturar resultados de laboratorio y generar el certificado médico final.*