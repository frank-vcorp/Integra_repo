/**
 * @file Server Actions: Catálogo Clínico
 * @description CRUD con validación Zod para TestCategory y MedicalTest.
 * @see context/SPECs/ARCH-20260313-01-CATALOGO-ESTUDIOS-PERFILES.md
 * @id IMPL-20260313-02
 */
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { GenderRestriction } from '@prisma/client'
import prisma from '@/lib/prisma'

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS ZOD
// ─────────────────────────────────────────────────────────────────────────────

const TestCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(120),
  description: z.string().max(500).optional(),
})

const MedicalTestSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es obligatorio')
    .max(30)
    .regex(/^[A-Z0-9_-]+$/, 'Solo mayúsculas, números, guión o guión bajo'),
  name: z.string().min(1, 'El nombre es obligatorio').max(200),
  categoryId: z.string().uuid('Categoría inválida'),
  targetGender: z.nativeEnum(GenderRestriction).default('ALL'),
  options: z.array(z.string().max(100)).default([]),
})

// ─────────────────────────────────────────────────────────────────────────────
// TIPO RESULTADO UNIFICADO
// ─────────────────────────────────────────────────────────────────────────────

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

// ─────────────────────────────────────────────────────────────────────────────
// TEST CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

export async function getTestCategories() {
  return await prisma.testCategory.findMany({
    include: { _count: { select: { tests: true } } },
    orderBy: { name: 'asc' },
  })
}

export async function createTestCategory(
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description') || undefined,
  }

  const parsed = TestCategorySchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await prisma.testCategory.create({ data: parsed.data })
    revalidatePath('/admin/clinical-catalog')
    return { success: true }
  } catch (e: unknown) {
    console.error('[ClinicalCatalog] Error creando categoría:', e)
    return { success: false, error: 'Error al crear la categoría' }
  }
}

export async function updateTestCategory(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const parsed = TestCategorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await prisma.testCategory.update({ where: { id }, data: parsed.data })
    revalidatePath('/admin/clinical-catalog')
    return { success: true }
  } catch (e: unknown) {
    console.error('[ClinicalCatalog] Error actualizando categoría:', e)
    return { success: false, error: 'Error al actualizar la categoría' }
  }
}

export async function deleteTestCategory(id: string): Promise<ActionResult> {
  try {
    const testsCount = await prisma.medicalTest.count({ where: { categoryId: id } })
    if (testsCount > 0) {
      return {
        success: false,
        error: `No se puede eliminar: tiene ${testsCount} prueba(s) asociada(s). Reasigna o elimina las pruebas primero.`,
      }
    }
    await prisma.testCategory.delete({ where: { id } })
    revalidatePath('/admin/clinical-catalog')
    return { success: true }
  } catch (e: unknown) {
    console.error('[ClinicalCatalog] Error eliminando categoría:', e)
    return { success: false, error: 'Error al eliminar la categoría' }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDICAL TESTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getMedicalTests() {
  return await prisma.medicalTest.findMany({
    include: { category: true },
    orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
  })
}

export async function createMedicalTest(
  formData: FormData
): Promise<ActionResult> {
  const rawOptions = formData.get('options') as string
  const parsedOptions = rawOptions
    ? rawOptions
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  const rawData = {
    code: (formData.get('code') as string)?.toUpperCase().trim(),
    name: formData.get('name'),
    categoryId: formData.get('categoryId'),
    targetGender: formData.get('targetGender') || 'ALL',
    options: parsedOptions,
  }

  const parsed = MedicalTestSchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await prisma.medicalTest.create({
      data: {
        code: parsed.data.code,
        name: parsed.data.name,
        categoryId: parsed.data.categoryId,
        targetGender: parsed.data.targetGender,
        options: parsed.data.options,
      },
    })
    revalidatePath('/admin/clinical-catalog')
    return { success: true }
  } catch (e: unknown) {
    const error = e as { code?: string }
    if (error.code === 'P2002') {
      return { success: false, error: `El código "${rawData.code}" ya existe` }
    }
    console.error('[ClinicalCatalog] Error creando prueba:', e)
    return { success: false, error: 'Error al crear la prueba' }
  }
}

export async function updateMedicalTest(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const rawOptions = formData.get('options') as string
  const parsedOptions = rawOptions
    ? rawOptions
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  const parsed = MedicalTestSchema.safeParse({
    code: (formData.get('code') as string)?.toUpperCase().trim(),
    name: formData.get('name'),
    categoryId: formData.get('categoryId'),
    targetGender: formData.get('targetGender') || 'ALL',
    options: parsedOptions,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await prisma.medicalTest.update({
      where: { id },
      data: {
        code: parsed.data.code,
        name: parsed.data.name,
        categoryId: parsed.data.categoryId,
        targetGender: parsed.data.targetGender,
        options: parsed.data.options,
      },
    })
    revalidatePath('/admin/clinical-catalog')
    return { success: true }
  } catch (e: unknown) {
    const error = e as { code?: string }
    if (error.code === 'P2002') {
      return { success: false, error: `El código ya está en uso por otra prueba` }
    }
    console.error('[ClinicalCatalog] Error actualizando prueba:', e)
    return { success: false, error: 'Error al actualizar la prueba' }
  }
}

export async function deleteMedicalTest(id: string): Promise<ActionResult> {
  try {
    await prisma.medicalTest.delete({ where: { id } })
    revalidatePath('/admin/clinical-catalog')
    return { success: true }
  } catch (e: unknown) {
    const error = e as { code?: string }
    if (error.code === 'P2003') {
      return {
        success: false,
        error: 'No se puede eliminar: la prueba está asociada a perfiles o expedientes.',
      }
    }
    console.error('[ClinicalCatalog] Error eliminando prueba:', e)
    return { success: false, error: 'Error al eliminar la prueba' }
  }
}
