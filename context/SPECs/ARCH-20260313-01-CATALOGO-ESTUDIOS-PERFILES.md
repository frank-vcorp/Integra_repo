# SPEC: Arquitectura de Catálogo Clínico y Perfiles B2B

- **ID:** `ARCH-20260313-01`
- **Módulo:** Piso Clínico & Catálogos (B2B Reseller)
- **Autor:** INTEGRA
- **Estado:** ✅ APROBADO 

## 1. Objetivo
Refactorizar y expandir la base de datos (reemplazando los modelos genéricos `Service` y `ServiceProfile` si es necesario, o adaptándolos) para soportar el nuevo flujo clínico de Pruebas Dinámicas, Perfiles B2B (Manejo de terceros/resellers como Sodexo) y la trazabilidad histórica inmutable de expedientes, basado en el dictamen `FIX-20260313-01`.

## 2. Entidades Nuevas / Modificadas

### 2.1. El Catálogo Maestro (Menú)
Se deben añadir/adaptar estos modelos en Prisma (`frontend/prisma/schema.prisma`):

*   **`TestCategory` (Nueva tabla)**
    *   `id`: String (UUID)
    *   `name`: String (Ej: "Laboratorio", "Imagen", "Somatometría")
    *   `description`: String?

*   **`MedicalTest` (Reemplaza/Evoluciona a `Service`)**
    *   `id`: String (UUID)
    *   `code`: String @unique
    *   `name`: String
    *   `categoryId`: Relación a `TestCategory`
    *   `options`: Json (Ej: `["Inertes", "Agua", "Alimentos"]`)
    *   `targetGender`: Enum `GenderRestriction` (`MALE`, `FEMALE`, `ALL`)
    *   *Nota: Las pruebas ya no van solas, se asocian a una categoría real.*

### 2.2. Perfiles Médicos B2B (Combos)
*   **`MedicalProfile` (Evoluciona a `ServiceProfile`)**
    *   `id`: String (UUID)
    *   `name`: String (Ej: "Operativo Safran")
    *   `companyId`: String? (Relación con Empresa, para manejar exclusividad de perfil a un cliente/reseller específico).
    *   **Relación (N a M explicita recomendada):** `ProfileTest` para unir Perfil <-> Prueba.

*   **`ProfileTest` (Tabla Pivote o Relación Implícita)**
    *   Para vincular `MedicalProfile` y `MedicalTest`. (Puede ser implícita en Prisma si no requiere campos adicionales por ahora).

### 2.3. Transaccional / Instanciador (El Expediente)
*   **`MedicalEvent` (Modificación Clave)**
    *   *Agregar* `billingCompanyId` (A quién se le cobra: ej. Sodexo). Relación a `Company`.
    *   *Mantener* la relación actual implícita del `Worker` como la empresa de origen (`workerCompanyId`). 
    *   *No romper* las relaciones existentes que usa Vercel.

*   **`EventTest` (Nueva tabla)**
    *   `id`: String (UUID)
    *   `eventId`: Relación a `MedicalEvent`
    *   `testId`: Relación a `MedicalTest` (Opcional, puede ser null si la prueba ya no existe).
    *   `testNameSnapshot`: String (Snapshot inmutable del nombre de la prueba, ej: "Bacteriológico").
    *   `selectedOption`: String? (Si la enfermera elige "Agua" del JSON de options).
    *   `status`: Enum `EventTestStatus` (`PENDING`, `COMPLETED`, `SKIPPED`, `CANCELLED`).
    *   `performedById`: Relación a `User` (Quién hizo/validó la prueba. Opcional).

## 3. Enumeraciones requeridas
*   `enum GenderRestriction { ALL, MALE, FEMALE }`
*   `enum EventTestStatus { PENDING, COMPLETED, SKIPPED, CANCELLED }`

## 4. Instrucciones para SOFIA (Implementación)
1. Modificar `frontend/prisma/schema.prisma` respetando el esquema actual, pero integrando estos nuevos modelos/campos.
2. Como hay datos existentes (y posiblemente choquen si borramos `Service`), evaluar si es mejor refactorizar `Service` renombrándolo a `MedicalTest` (usando `@@map("services")`) o crear las tablas `MedicalTest` de cero. El objetivo es que la BD coincida con el modelo mental.
3. Crear migración: `pnpm exec prisma migrate dev --name init_clinical_tests_profiles`.
4. Dejar el código Prisma listo para el frontend.