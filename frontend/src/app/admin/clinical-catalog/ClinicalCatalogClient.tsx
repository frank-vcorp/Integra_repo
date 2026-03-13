'use client'
/**
 * @file Componente cliente: Catálogo Clínico (Categorías + Pruebas)
 * @id IMPL-20260313-02
 * @see context/SPECs/ARCH-20260313-01-CATALOGO-ESTUDIOS-PERFILES.md
 */

import { useState, useTransition } from 'react'
import {
  createTestCategory,
  updateTestCategory,
  deleteTestCategory,
  createMedicalTest,
  updateMedicalTest,
  deleteMedicalTest,
} from '@/actions/clinical-catalog'
import type { TestCategory, MedicalTest, GenderRestriction } from '@prisma/client'

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

type TestCategoryWithCount = TestCategory & { _count: { tests: number } }
type MedicalTestWithCategory = MedicalTest & { category: TestCategory }

interface Props {
  categories: TestCategoryWithCount[]
  tests: MedicalTestWithCategory[]
}

type ActiveTab = 'categories' | 'tests'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function ClinicalCatalogClient({ categories, tests }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('categories')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Catálogo Clínico</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gestiona las categorías de estudios y las pruebas médicas disponibles.
        </p>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-0">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            🗂️ Categorías ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tests'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            🔬 Pruebas Médicas ({tests.length})
          </button>
        </nav>
      </div>

      {/* Contenido por tab */}
      {activeTab === 'categories' && (
        <CategoriesSection
          categories={categories}
          onFeedback={showFeedback}
        />
      )}
      {activeTab === 'tests' && (
        <TestsSection
          tests={tests}
          categories={categories}
          onFeedback={showFeedback}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN CATEGORÍAS
// ─────────────────────────────────────────────────────────────────────────────

function CategoriesSection({
  categories,
  onFeedback,
}: {
  categories: TestCategoryWithCount[]
  onFeedback: (type: 'success' | 'error', message: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [editTarget, setEditTarget] = useState<TestCategory | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      const result = await createTestCategory(formData)
      if (result.success) {
        setShowModal(false)
        onFeedback('success', 'Categoría creada exitosamente')
      } else {
        onFeedback('error', result.error)
      }
    })
  }

  const handleUpdate = (formData: FormData) => {
    if (!editTarget) return
    startTransition(async () => {
      const result = await updateTestCategory(editTarget.id, formData)
      if (result.success) {
        setEditTarget(null)
        onFeedback('success', 'Categoría actualizada exitosamente')
      } else {
        onFeedback('error', result.error)
      }
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`¿Eliminar la categoría "${name}"? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      const result = await deleteTestCategory(id)
      result.success
        ? onFeedback('success', 'Categoría eliminada')
        : onFeedback('error', result.error)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow flex items-center gap-2"
        >
          <span>+</span> Nueva Categoría
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4 text-center">Pruebas</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                <td className="px-6 py-4 text-slate-500">{cat.description || '—'}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                    {cat._count.tests}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button
                    onClick={() => setEditTarget(cat)}
                    className="text-slate-400 hover:text-blue-600 font-medium text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={isPending || cat._count.tests > 0}
                    className="text-slate-400 hover:text-red-500 font-medium text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                    title={cat._count.tests > 0 ? 'Tiene pruebas asociadas' : 'Eliminar'}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                  No hay categorías registradas. Agrega una para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Crear */}
      {showModal && (
        <CategoryModal
          title="Nueva Categoría"
          onSubmit={handleCreate}
          onClose={() => setShowModal(false)}
          isPending={isPending}
        />
      )}

      {/* Modal: Editar */}
      {editTarget && (
        <CategoryModal
          title="Editar Categoría"
          defaultValues={editTarget}
          onSubmit={handleUpdate}
          onClose={() => setEditTarget(null)}
          isPending={isPending}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL CATEGORÍA
// ─────────────────────────────────────────────────────────────────────────────

function CategoryModal({
  title,
  defaultValues,
  onSubmit,
  onClose,
  isPending,
}: {
  title: string
  defaultValues?: Pick<TestCategory, 'name' | 'description'>
  onSubmit: (fd: FormData) => void
  onClose: () => void
  isPending: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
        </div>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre *</label>
            <input
              name="name"
              defaultValue={defaultValues?.name ?? ''}
              placeholder="Ej: Laboratorio Clínico"
              required
              className="w-full border border-slate-200 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción</label>
            <textarea
              name="description"
              defaultValue={defaultValues?.description ?? ''}
              placeholder="Descripción breve de la categoría"
              rows={3}
              className="w-full border border-slate-200 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-medium text-sm disabled:opacity-60"
            >
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN PRUEBAS MÉDICAS
// ─────────────────────────────────────────────────────────────────────────────

const GENDER_LABELS: Record<GenderRestriction, string> = {
  ALL: 'Todos',
  MALE: 'Solo Hombres',
  FEMALE: 'Solo Mujeres',
}

function TestsSection({
  tests,
  categories,
  onFeedback,
}: {
  tests: MedicalTestWithCategory[]
  categories: TestCategoryWithCount[]
  onFeedback: (type: 'success' | 'error', message: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [editTarget, setEditTarget] = useState<MedicalTest | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      const result = await createMedicalTest(formData)
      if (result.success) {
        setShowModal(false)
        onFeedback('success', 'Prueba creada exitosamente')
      } else {
        onFeedback('error', result.error)
      }
    })
  }

  const handleUpdate = (formData: FormData) => {
    if (!editTarget) return
    startTransition(async () => {
      const result = await updateMedicalTest(editTarget.id, formData)
      if (result.success) {
        setEditTarget(null)
        onFeedback('success', 'Prueba actualizada exitosamente')
      } else {
        onFeedback('error', result.error)
      }
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`¿Eliminar la prueba "${name}"? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      const result = await deleteMedicalTest(id)
      result.success
        ? onFeedback('success', 'Prueba eliminada')
        : onFeedback('error', result.error)
    })
  }

  return (
    <div className="space-y-4">
      {categories.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ Primero crea al menos una categoría antes de agregar pruebas.
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          disabled={categories.length === 0}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>+</span> Nueva Prueba
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Género</th>
              <th className="px-6 py-4">Opciones</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tests.map((test) => {
              const options = Array.isArray(test.options) ? (test.options as string[]) : []
              return (
                <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-400 text-xs">{test.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{test.name}</td>
                  <td className="px-6 py-4 text-slate-500">{test.category.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        test.targetGender === 'ALL'
                          ? 'bg-slate-100 text-slate-600'
                          : test.targetGender === 'MALE'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-pink-50 text-pink-700'
                      }`}
                    >
                      {GENDER_LABELS[test.targetGender]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {options.length > 0 ? (
                      <span title={options.join(', ')}>
                        {options.slice(0, 2).join(', ')}{options.length > 2 ? ` +${options.length - 2}` : ''}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button
                      onClick={() => setEditTarget(test)}
                      className="text-slate-400 hover:text-blue-600 font-medium text-xs"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(test.id, test.name)}
                      disabled={isPending}
                      className="text-slate-400 hover:text-red-500 font-medium text-xs disabled:opacity-30"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
            {tests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  No hay pruebas registradas aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Crear */}
      {showModal && (
        <MedicalTestModal
          title="Nueva Prueba Médica"
          categories={categories}
          onSubmit={handleCreate}
          onClose={() => setShowModal(false)}
          isPending={isPending}
        />
      )}

      {/* Modal: Editar */}
      {editTarget && (
        <MedicalTestModal
          title="Editar Prueba Médica"
          categories={categories}
          defaultValues={editTarget}
          onSubmit={handleUpdate}
          onClose={() => setEditTarget(null)}
          isPending={isPending}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL PRUEBA MÉDICA
// ─────────────────────────────────────────────────────────────────────────────

function MedicalTestModal({
  title,
  categories,
  defaultValues,
  onSubmit,
  onClose,
  isPending,
}: {
  title: string
  categories: TestCategoryWithCount[]
  defaultValues?: MedicalTest
  onSubmit: (fd: FormData) => void
  onClose: () => void
  isPending: boolean
}) {
  const defaultOptions = defaultValues?.options
    ? (defaultValues.options as string[]).join('\n')
    : ''

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
        </div>
        <form action={onSubmit} className="space-y-4">
          {/* Código + Nombre */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Código * (ej: LAB-BH)</label>
              <input
                name="code"
                defaultValue={defaultValues?.code ?? ''}
                placeholder="LAB-BH"
                required
                className="w-full border border-slate-200 p-2 rounded uppercase focus:ring-2 focus:ring-blue-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Categoría *</label>
              <select
                name="categoryId"
                defaultValue={defaultValues?.categoryId ?? ''}
                required
                className="w-full border border-slate-200 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Selecciona...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre de la Prueba *</label>
            <input
              name="name"
              defaultValue={defaultValues?.name ?? ''}
              placeholder="Ej: Biometría Hemática Completa"
              required
              className="w-full border border-slate-200 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Restricción de Género</label>
            <select
              name="targetGender"
              defaultValue={defaultValues?.targetGender ?? 'ALL'}
              className="w-full border border-slate-200 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="ALL">Todos</option>
              <option value="MALE">Solo Hombres</option>
              <option value="FEMALE">Solo Mujeres</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Opciones Dinámicas
              <span className="ml-1 text-slate-400 font-normal">(una por línea, ej: Inertes / Agua / Alimentos)</span>
            </label>
            <textarea
              name="options"
              defaultValue={defaultOptions}
              placeholder={'Inertes\nAgua\nAlimentos'}
              rows={4}
              className="w-full border border-slate-200 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none font-mono text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-medium text-sm disabled:opacity-60"
            >
              {isPending ? 'Guardando...' : 'Guardar Prueba'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
