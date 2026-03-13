'use client'
/**
 * @file Componente cliente: Perfiles Médicos (Armador de Paquetes/Combos B2B)
 * @description Permite a Lety crear/editar perfiles: nombre, empresa cliente y selección
 *              de pruebas médicas agrupadas por categoría.
 * @id IMPL-20260313-03
 * @see context/SPECs/ARCH-20260313-01-CATALOGO-ESTUDIOS-PERFILES.md
 */

import { useState, useTransition, useMemo } from 'react'
import {
  createMedicalProfile,
  updateMedicalProfile,
  deleteMedicalProfile,
} from '@/actions/medical-profiles'
import type { MedicalProfile, MedicalTest, TestCategory, Company } from '@prisma/client'

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

type TestWithCategory = MedicalTest & { category: TestCategory }

type ProfileTestDetail = {
  id: string
  profileId: string
  testId: string
  test: {
    id: string
    name: string
    code: string
    category: { name: string }
  }
}

type ProfileWithDetails = MedicalProfile & {
  company: { id: string; name: string } | null
  tests: ProfileTestDetail[]
  _count: { tests: number }
}

type CompanyOption = Pick<Company, 'id' | 'name'>

interface Props {
  profiles: ProfileWithDetails[]
  tests: TestWithCategory[]
  companies: CompanyOption[]
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function MedicalProfilesClient({ profiles, tests, companies }: Props) {
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">📦 Perfiles Médicos</h2>
        <p className="text-sm text-slate-500 mt-1">
          Arma paquetes (combos) de pruebas médicas. Puedes asignarlos a una empresa cliente
          específica (modelo Sodexo) o dejarlos disponibles de forma general.
        </p>
      </div>

      {/* Feedback global */}
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

      {/* Advertencia si no hay pruebas */}
      {tests.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ No hay pruebas médicas en el catálogo. Ve a{' '}
          <a href="/admin/clinical-catalog" className="font-semibold underline">
            Catálogo Clínico
          </a>{' '}
          para agregar pruebas antes de crear perfiles.
        </div>
      )}

      <ProfilesSection
        profiles={profiles}
        tests={tests}
        companies={companies}
        onFeedback={showFeedback}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN PERFILES
// ─────────────────────────────────────────────────────────────────────────────

function ProfilesSection({
  profiles,
  tests,
  companies,
  onFeedback,
}: {
  profiles: ProfileWithDetails[]
  tests: TestWithCategory[]
  companies: CompanyOption[]
  onFeedback: (type: 'success' | 'error', message: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [editTarget, setEditTarget] = useState<ProfileWithDetails | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      const result = await createMedicalProfile(formData)
      if (result.success) {
        setShowModal(false)
        onFeedback('success', 'Perfil médico creado exitosamente')
      } else {
        onFeedback('error', result.error)
      }
    })
  }

  const handleUpdate = (formData: FormData) => {
    if (!editTarget) return
    startTransition(async () => {
      const result = await updateMedicalProfile(editTarget.id, formData)
      if (result.success) {
        setEditTarget(null)
        onFeedback('success', 'Perfil médico actualizado exitosamente')
      } else {
        onFeedback('error', result.error)
      }
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (
      !confirm(
        `¿Eliminar el perfil "${name}"? Esta acción no se puede deshacer y eliminará todas las asociaciones de pruebas.`
      )
    )
      return
    startTransition(async () => {
      const result = await deleteMedicalProfile(id)
      if (result.success) {
        onFeedback('success', `Perfil "${name}" eliminado`)
      } else {
        onFeedback('error', result.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          disabled={tests.length === 0}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          title={tests.length === 0 ? 'Agrega pruebas al catálogo primero' : undefined}
        >
          <span>+</span> Nuevo Perfil
        </button>
      </div>

      {/* Tabla de perfiles */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Nombre del Perfil</th>
              <th className="px-6 py-4">Empresa Cliente</th>
              <th className="px-6 py-4 text-center">Pruebas</th>
              <th className="px-6 py-4">Contenido</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{profile.name}</td>
                <td className="px-6 py-4">
                  {profile.company ? (
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
                      {profile.company.name}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">General</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                    {profile._count.tests}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-sm">
                    {profile.tests.slice(0, 4).map((pt) => (
                      <span
                        key={pt.id}
                        className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs"
                        title={pt.test.name}
                      >
                        {pt.test.code}
                      </span>
                    ))}
                    {profile.tests.length > 4 && (
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs">
                        +{profile.tests.length - 4} más
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditTarget(profile)}
                      disabled={isPending}
                      className="text-slate-400 hover:text-blue-600 font-medium text-xs disabled:opacity-30"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id, profile.name)}
                      disabled={isPending}
                      className="text-slate-400 hover:text-red-500 font-medium text-xs disabled:opacity-30"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No hay perfiles médicos registrados. Crea el primero con el botón &quot;+ Nuevo
                  Perfil&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Crear */}
      {showModal && (
        <ProfileModal
          title="Nuevo Perfil Médico"
          tests={tests}
          companies={companies}
          onSubmit={handleCreate}
          onClose={() => setShowModal(false)}
          isPending={isPending}
        />
      )}

      {/* Modal: Editar */}
      {editTarget && (
        <ProfileModal
          title="Editar Perfil Médico"
          tests={tests}
          companies={companies}
          defaultValues={{
            name: editTarget.name,
            companyId: editTarget.companyId ?? null,
            testIds: editTarget.tests.map((pt) => pt.testId),
          }}
          onSubmit={handleUpdate}
          onClose={() => setEditTarget(null)}
          isPending={isPending}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: CREAR / EDITAR PERFIL
// ─────────────────────────────────────────────────────────────────────────────

type ProfileDefaultValues = {
  name: string
  companyId: string | null
  testIds: string[]
}

function ProfileModal({
  title,
  tests,
  companies,
  defaultValues,
  onSubmit,
  onClose,
  isPending,
}: {
  title: string
  tests: TestWithCategory[]
  companies: CompanyOption[]
  defaultValues?: ProfileDefaultValues
  onSubmit: (fd: FormData) => void
  onClose: () => void
  isPending: boolean
}) {
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>(
    defaultValues?.testIds ?? []
  )
  const [searchQuery, setSearchQuery] = useState('')

  const toggleTest = (id: string) => {
    setSelectedTestIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Agrupa las pruebas filtradas por nombre de categoría
  const testsByCategory = useMemo(() => {
    const filtered = searchQuery.trim()
      ? tests.filter(
          (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tests

    const groups: Record<string, { categoryName: string; tests: TestWithCategory[] }> = {}
    for (const test of filtered) {
      const catName = test.category.name
      if (!groups[catName]) {
        groups[catName] = { categoryName: catName, tests: [] }
      }
      groups[catName].tests.push(test)
    }
    return Object.values(groups).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    )
  }, [tests, searchQuery])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 flex-shrink-0">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 font-bold text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          action={(fd) => {
            // Inyecta el JSON de testIds seleccionados antes de delegar
            fd.set('testIds', JSON.stringify(selectedTestIds))
            onSubmit(fd)
          }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Nombre del perfil */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Nombre del Perfil *
              </label>
              <input
                name="name"
                defaultValue={defaultValues?.name ?? ''}
                placeholder="Ej: Operativo Safran, Ingreso Sodexo..."
                required
                maxLength={200}
                className="w-full border border-slate-200 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
            </div>

            {/* Empresa cliente (opcional - modelo Sodexo) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Empresa Cliente{' '}
                <span className="text-slate-400 font-normal">(opcional — modelo Sodexo)</span>
              </label>
              <select
                name="companyId"
                defaultValue={defaultValues?.companyId ?? ''}
                className="w-full border border-slate-200 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm bg-white"
              >
                <option value="">General (disponible para todos los clientes)</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Si seleccionas una empresa, este perfil solo aparecerá para sus expedientes.
              </p>
            </div>

            {/* Selección de pruebas médicas */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-600">
                  Pruebas del Paquete *{' '}
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      selectedTestIds.length === 0
                        ? 'bg-red-50 text-red-600'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {selectedTestIds.length} seleccionada(s)
                  </span>
                </label>
                {selectedTestIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTestIds([])}
                    className="text-xs text-slate-400 hover:text-red-500"
                  >
                    Desmarcar todas
                  </button>
                )}
              </div>

              {/* Buscador de pruebas */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar prueba por nombre o código..."
                className="w-full border border-slate-200 p-2 rounded text-sm mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

              {/* Lista de pruebas por categoría */}
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {testsByCategory.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-slate-400">
                    No se encontraron pruebas con ese criterio.
                  </p>
                )}
                {testsByCategory.map((group) => (
                  <div key={group.categoryName}>
                    <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide sticky top-0">
                      {group.categoryName}
                    </div>
                    <div className="divide-y divide-slate-50">
                      {group.tests.map((test) => {
                        const isSelected = selectedTestIds.includes(test.id)
                        return (
                          <label
                            key={test.id}
                            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                              isSelected
                                ? 'bg-blue-50 text-blue-800'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
                              checked={isSelected}
                              onChange={() => toggleTest(test.id)}
                            />
                            <span className="flex-1 font-medium">{test.name}</span>
                            <span className="text-xs text-slate-400 font-mono">{test.code}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {selectedTestIds.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Selecciona al menos una prueba para guardar el perfil.
                </p>
              )}
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="flex justify-end gap-3 p-6 border-t border-slate-200 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || selectedTestIds.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Guardando...' : 'Guardar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
