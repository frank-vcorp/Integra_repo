# SPEC: Gestión de Puestos de Trabajo (B2B)
**ID:** ARCH-20260313-04
**Fecha:** 2026-03-13
**Autor:** INTEGRA - Arquitecto

## 1. Contexto y Objetivo
Se requiere habilitar la arquitectura B2B para gestionar "Puestos de Trabajo" (`JobPosition`) dentro de las empresas clientes (`Company`). Esto permite asociar un perfil médico predeterminado (`MedicalProfile`) a un puesto específico estructuralmente, facilitando la asignación automática de los exámenes médicos requeridos cuando un trabajador es asignado a dicho puesto.

## 2. Esquema de Base de Datos (Prisma)

### Nuevo Modelo: `JobPosition`
```prisma
model JobPosition {
  id               String          @id @default(cuid())
  name             String
  description      String?
  companyId        String
  company          Company         @relation(fields: [companyId], references: [id], onDelete: Cascade)
  defaultProfileId String?
  defaultProfile   MedicalProfile? @relation(fields: [defaultProfileId], references: [id])
  workers          Worker[]
  isActive         Boolean         @default(true)
  
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  @@index([companyId])
  @@index([defaultProfileId])
}
```

### Actualización al modelo `Worker`
```prisma
model Worker {
  // ... campos existentes
  jobPositionId    String?
  jobPosition      JobPosition?    @relation(fields: [jobPositionId], references: [id])
  // ...
  
  @@index([jobPositionId])
}
```

### Actualización a `Company` y `MedicalProfile`
- En `Company`: Agregar `jobPositions JobPosition[]`
- En `MedicalProfile`: Agregar `jobPositions JobPosition[]` (Este modelo ya cuenta con `companyId` opcional para ser propiedad de una empresa).

## 3. Lógica de Negocio
1. **Creación de Perfiles B2B:** El área médica o la empresa crea un `MedicalProfile` específico y lo asocia a su `Company` (estableciendo `companyId`).
2. **Creación de Puestos:** En la administración de la Empresa, se crean instancias de `JobPosition` asociadas a esa misma `Company`.
3. **Asignación de Perfil por Defecto:** Al `JobPosition` se le establece el `defaultProfileId` apuntando al perfil médico creado.
4. **Vinculación de Trabajador:** Cuando se registra o actualiza un `Worker`, se le asigna su `jobPositionId`. Posteriormente, el motor de citas/triaje utilizará el `defaultProfileId` de este puesto para precargar el catálogo de exámenes que el trabajador requiere realizarse.

## 4. Tareas de Implementación (Para SOFIA)
- [ ] **T1:** Actualizar `schema.prisma` con el nuevo modelo `JobPosition`, las relaciones inversas en `Company` / `MedicalProfile`, y el nuevo campo en `Worker`.
- [ ] **T2:** Generar y aplicar migración en base de datos.
- [ ] **T3:** Crear Server Actions (`src/actions/job-position.actions.ts`) para el CRUD de Puestos de Trabajo.
- [ ] **T4:** Actualizar Server Actions de `Worker` para permitir asignar y guardar `jobPositionId`.
- [ ] **T5:** Crear UI de gestión (ej. `/dashboard/companies/[id]/positions`) donde los administradores de la empresa puedan configurar sus puestos y asignar perfiles.
- [ ] **T6:** Actualizar el formulario de creación/edición de `Worker` para incluir un selector dinámico de Puesto de Trabajo (filtrado por la empresa seleccionada).

## 5. Criterios de Aceptación
- Un Puesto de Trabajo se crea correctamente y queda asociado a una Empresa.
- Se puede asignar un Perfil Médico (opcionalmente) a un Puesto de Trabajo.
- El perfil del Trabajador muestra su Puesto de Trabajo asignado si lo tiene.
