/**
 * @file Server Actions: Papeleta Electrónica — EventTest
 * @description Permite a la enfermera actualizar el estado de una prueba instanciada.
 * @see context/SPECs/ARCH-20260313-01-CATALOGO-ESTUDIOS-PERFILES.md
 * @id IMPL-20260313-04
 */
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { EventTestStatus } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA ZOD
// ─────────────────────────────────────────────────────────────────────────────

const UpdateEventTestSchema = z.object({
  eventTestId: z.string().uuid('ID de prueba inválido'),
  status: z.nativeEnum(EventTestStatus),
})

// ─────────────────────────────────────────────────────────────────────────────
// ACTION
// ─────────────────────────────────────────────────────────────────────────────

export async function updateEventTestStatus(
  eventTestId: string,
  status: EventTestStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    const validated = UpdateEventTestSchema.safeParse({ eventTestId, status })
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const eventTest = await prisma.eventTest.findUnique({
      where: { id: eventTestId },
      select: { eventId: true },
    })

    if (!eventTest) {
      return { success: false, error: 'Prueba no encontrada' }
    }

    await prisma.eventTest.update({
      where: { id: eventTestId },
      data: {
        status,
        performedById: session.user.id,
      },
    })

    revalidatePath(`/events/${eventTest.eventId}`)
    return { success: true }
  } catch (error) {
    console.error('[UPDATE EVENT TEST STATUS ERROR]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar estado de la prueba',
    }
  }
}
