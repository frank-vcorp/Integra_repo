/**
 * @file Admin: Perfiles Médicos — Server Component
 * @description Carga datos y renderiza el armador de paquetes/combos B2B.
 * @id IMPL-20260313-03
 * @see context/SPECs/ARCH-20260313-01-CATALOGO-ESTUDIOS-PERFILES.md
 */
import { getMedicalProfiles } from '@/actions/medical-profiles'
import { getMedicalTests } from '@/actions/clinical-catalog'
import { getCompanies } from '@/actions/company.actions'
import MedicalProfilesClient from './MedicalProfilesClient'

export const metadata = {
  title: 'Perfiles Médicos | AMI Admin',
}

export default async function MedicalProfilesPage() {
  const [profiles, tests, companies] = await Promise.all([
    getMedicalProfiles(),
    getMedicalTests(),
    getCompanies(),
  ])

  return (
    <MedicalProfilesClient
      profiles={profiles}
      tests={tests}
      companies={companies}
    />
  )
}
