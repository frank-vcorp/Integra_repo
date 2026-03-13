/**
 * @file Admin: Catálogo Clínico — Server Component
 * @description Página administrativa para gestión de TestCategory y MedicalTest.
 * @id IMPL-20260313-02
 * @see context/SPECs/ARCH-20260313-01-CATALOGO-ESTUDIOS-PERFILES.md
 */
import { getTestCategories, getMedicalTests } from '@/actions/clinical-catalog'
import ClinicalCatalogClient from './ClinicalCatalogClient'

export const metadata = {
  title: 'Catálogo Clínico | AMI Admin',
}

export default async function ClinicalCatalogPage() {
  const [categories, tests] = await Promise.all([
    getTestCategories(),
    getMedicalTests(),
  ])

  return (
    <ClinicalCatalogClient
      categories={categories}
      tests={tests}
    />
  )
}
