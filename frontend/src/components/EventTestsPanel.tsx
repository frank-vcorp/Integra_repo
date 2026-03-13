'use client'

/**
 * @file Papeleta Electrónica — Panel de Pruebas Instanciadas
 * @description Muestra los EventTest de un evento médico y permite a la enfermera
 *              marcarlos como COMPLETED, SKIPPED o CANCELLED.
 * @id IMPL-20260313-04
 */

import { useState, useTransition } from 'react'
import { EventTestStatus } from '@prisma/client'
import { updateEventTestStatus } from '@/actions/event-test.actions'

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS LOCALES
// ─────────────────────────────────────────────────────────────────────────────

interface EventTestItem {
  id: string
  testNameSnapshot: string
  status: EventTestStatus
  test: {
    id: string
    code: string
    category: { name: string }
  } | null
}

interface EventTestsPanelProps {
  eventTests: EventTestItem[]
  readonly?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS VISUALES
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  EventTestStatus,
  { label: string; icon: string; badgeClass: string }
> = {
  PENDING: {
    label: 'Pendiente',
    icon: '⏳',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  COMPLETED: {
    label: 'Completado',
    icon: '✅',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  SKIPPED: {
    label: 'Omitido',
    icon: '⏭️',
    badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
  },
  CANCELLED: {
    label: 'Cancelado',
    icon: '❌',
    badgeClass: 'bg-red-50 text-red-600 border-red-200',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTE: Fila de prueba
// ─────────────────────────────────────────────────────────────────────────────

function EventTestRow({
  item,
  readonly,
}: {
  item: EventTestItem
  readonly: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [localStatus, setLocalStatus] = useState<EventTestStatus>(item.status)
  const [error, setError] = useState<string | null>(null)

  const config = STATUS_CONFIG[localStatus]

  function handleStatusChange(newStatus: EventTestStatus) {
    if (readonly || newStatus === localStatus) return
    setError(null)
    startTransition(async () => {
      const result = await updateEventTestStatus(item.id, newStatus)
      if (result.success) {
        setLocalStatus(newStatus)
      } else {
        setError(result.error ?? 'Error desconocido')
      }
    })
  }

  return (
    <div
      className={`flex items-center justify-between gap-4 p-3 rounded-lg border transition-all ${
        localStatus === 'COMPLETED'
          ? 'bg-emerald-50/50 border-emerald-100'
          : 'bg-white border-slate-100'
      } ${isPending ? 'opacity-60' : ''}`}
    >
      {/* Checkbox visual — click rápido para COMPLETED/PENDING */}
      <button
        type="button"
        disabled={readonly || isPending}
        onClick={() =>
          handleStatusChange(localStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED')
        }
        className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          localStatus === 'COMPLETED'
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-slate-300 hover:border-emerald-400'
        } ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        aria-label={`Marcar "${item.testNameSnapshot}" como completado`}
      >
        {localStatus === 'COMPLETED' && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 12 10">
            <path
              d="M1 5l3.5 3.5L11 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Nombre + categoría */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            localStatus === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-700'
          }`}
        >
          {item.testNameSnapshot}
        </p>
        {item.test && (
          <p className="text-xs text-slate-400 truncate">
            {item.test.category.name} · {item.test.code}
          </p>
        )}
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>

      {/* Badge de estado + acciones rápidas */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${config.badgeClass}`}
        >
          {config.icon} {config.label}
        </span>

        {/* Menú de estados secundarios (SKIPPED / CANCELLED) — solo si no es readonly */}
        {!readonly && localStatus !== 'CANCELLED' && localStatus !== 'SKIPPED' && (
          <div className="flex gap-1">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange('SKIPPED')}
              title="Omitir"
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
            >
              ⏭
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange('CANCELLED')}
              title="Cancelar"
              className="text-xs text-slate-400 hover:text-red-500 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Botón para reabrir si fue omitido/cancelado */}
        {!readonly && (localStatus === 'CANCELLED' || localStatus === 'SKIPPED') && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleStatusChange('PENDING')}
            title="Restablecer"
            className="text-xs text-slate-400 hover:text-amber-600 px-1.5 py-0.5 rounded hover:bg-amber-50 transition-colors"
          >
            ↩
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function EventTestsPanel({ eventTests, readonly = false }: EventTestsPanelProps) {
  if (eventTests.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-lg">
            🧾
          </div>
          <h3 className="font-bold text-slate-800">Papeleta Electrónica</h3>
        </div>
        <p className="text-sm text-slate-400 pl-12">
          Esta cita no tiene un perfil médico asignado. No hay pruebas programadas.
        </p>
      </div>
    )
  }

  const completedCount = eventTests.filter((t) => t.status === 'COMPLETED').length
  const progress = Math.round((completedCount / eventTests.length) * 100)

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-lg">
            🧾
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Papeleta Electrónica</h3>
            <p className="text-xs text-slate-400">
              {completedCount} de {eventTests.length} pruebas completadas
            </p>
          </div>
        </div>
        <span className="text-sm font-bold text-teal-600">{progress}%</span>
      </div>

      {/* Barra de progreso */}
      <div className="h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Lista de pruebas */}
      <div className="space-y-2">
        {eventTests.map((item) => (
          <EventTestRow key={item.id} item={item} readonly={readonly} />
        ))}
      </div>
    </div>
  )
}
