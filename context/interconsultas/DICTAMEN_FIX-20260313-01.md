# DICTAMEN TÉCNICO: Análisis Preventivo Arquitectura BD - Módulo Clínico B2B (Modelo Reseller)
- **ID:** FIX-20260313-01
- **Fecha:** 2026-03-13
- **Solicitante:** INTEGRA
- **Estado:** ✅ VALIDADO (CON OBSERVACIONES CRÍTICAS)

### A. Análisis de Causa Raíz / Riesgos Forenses Detectados

Al analizar la estructura propuesta frente al modelo de negocio B2B (tipo Sodexo/Tercerizadoras), se han identificado los siguientes cuellos de botella y riesgos de integridad funcional y referencial:

1. **Riesgo Reseller vs. Cliente Final (Falta de Trazabilidad Comercial):**
   - *Síntoma:* `MedicalProfile` ligado a `Company`.
   - *Fallo latente:* En el modelo Sodexo, Sodexo (Reseller) paga el perfil, pero el paciente pertenece a la Empresa X (Cliente Final). Si el perfil o evento solo se asocia a una `Company`, se pierde la capacidad de facturar al reseller o se enmascara el empleador real del trabajador.

2. **Corrupción Histórica por Mutabilidad de JSON (`MedicalTest.options`):**
   - *Síntoma:* Opciones guardadas como JSON y `EventTest.selectedOption` como valor.
   - *Fallo latente:* Si en 2027 se modifican las opciones de un examen en el JSON de `MedicalTest` (ej. se elimina una opción o cambia la escala de valores), los `EventTest` de 2026 quedarán huérfanos de contexto o ininterpretables, corrompiendo el historial clínico pasado.

3. **Cuello de Botella en Kanban (Transiciones de Estado rígidas):**
   - *Síntoma:* Atributo binario `isCompleted` en `EventTest`.
   - *Fallo latente:* En la vida real, un paciente puede negarse a una prueba, la máquina puede fallar, o la prueba se pospone. Un booleano no abarca los estados "Cancelado" o "Diferido", lo que dejaría el `MedicalEvent` bloqueado indefinidamente en la columna "En Proceso" del Kanban esperando un `isCompleted = true` que nunca llegará.

### B. Justificación de la Solución (Contramedidas Preventivas)

Para vacunar la base de datos contra estos edge cases, se proponen las siguientes enmiendas al esquema (schema.prisma):

- **Ajuste 1 (Soporte B2B Reseller):** 
  En `MedicalEvent` (y opcionalmente en `MedicalProfile`), separar:
  - `billingCompanyId` (Factura a: Sodexo).
  - `workerCompanyId` (Trabaja en: Empresa X).
  *Justificación:* Permite reportería cruzada y facturación precisa sin sacrificar la trazabilidad patronal del paciente.

- **Ajuste 2 (Inmutabilidad Histórica):**
  En `EventTest`, no solo guardar `selectedOption`, sino una captura o snapshot de la opción elegida o requerir que los cambios en `MedicalTest` generen una *nueva versión* del test en lugar de sobreescribir el JSON anterior (Soft Delete / Versioning).

- **Ajuste 3 (Máquina de Estados de Pruebas):**
  Reemplazar `isCompleted: Boolean` en `EventTest` por `status: EventTestStatus` (Enum: `PENDING`, `COMPLETED`, `SKIPPED`, `CANCELLED`).
  *Justificación:* Permite que el Kanban avance si una prueba es "SKIPPED", desbloqueando el flujo del paciente.

### C. Instrucciones de Handoff para INTEGRA / SOFIA

**Para INTEGRA (Arquitectura):**
1. Actualiza la SPEC de Base de Datos integrando los campos de Trazabilidad Comercial (`billingCompanyId` vs `workerCompanyId`).
2. Cambia el diseño de estado en las pruebas del evento (`EventTestStatus` Enum).
3. Evalúa si `MedicalProfile` debe ser de alcance global (Tenant) o si los perfiles de los resellers deben ser plantillas clonadas.

**Para SOFIA (Implementación):**
1. Una vez INTEGRA autorice la SPEC con los cambios, modifica `schema.prisma`.
2. Asegura en la lógica del negocio que cuando se compute el progreso del `MedicalEvent`, los estados `SKIPPED` y `CANCELLED` de los `EventTest` cuenten como resueltos para no estancar la tarjeta en el Kanban.
